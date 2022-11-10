// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {FlashLoanReceiverBase} from "./Interfaces/FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces/Interfaces.sol";
import {SafeMath, SafeERC20} from "./Interfaces/Libraries.sol";
import {CErc20Storage, CErc20Interface, CTokenInterface, CETHInterface} from "./Interfaces/CTokenInterfaces.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "hardhat/console.sol";

/** 
    !!!
    Never keep funds permanently on your FlashLoanReceiverBase contract as they could be 
    exposed to a 'griefing' attack, where the stored funds are used by an attacker.
    !!!
 */
contract MyV2FlashLoan is FlashLoanReceiverBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Factory public factory;

    address internal constant UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address internal constant CETH_ADDRESS =
        0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;
    address internal constant ETH_RESERVE_ADDRESS =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    struct LocalVars {
        address _borrower;
        uint256 _repayAmount;
        address _cTokenRepay;
        address _cTokenCollateral;
        uint256 getLiquidityError;
        uint256 liquidity;
        uint256 shortfall;
        address underlyingAddress;
        address underlyingAddress1; // _cTokenCollateral underlying address
        uint256 liquidateBorrowError;
        uint256 liquidateBorrowError1;
        uint256 cTokenBalance; // ctoken Balance after Liquidation
        uint256 seizedTokens; // ctoken Balance after Liquidation
        uint256 redeemErrorCode;
        uint256 underlyingBalance;
        bool approveResponse;
        uint256 allowance;
        uint256 liquidatedAssetBalance;
        address path0;
        address path1;
        address path2;
        uint256 amountReceived;
        uint256 amountOwing;
    }

    constructor(ILendingPoolAddressesProvider _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        factory = IUniswapV2Factory(uniswapRouter.factory());
    }

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        console.log(">>>> The Debt received");
        console.log(">>> This Balance", address(this).balance);

        LocalVars memory vars;

        // LocalVars memory vars;
        console.log("SM-> Loans received");
        console.log("SM-> assets %s", assets[0]);
        console.log("SM-> amounts %s", amounts[0]);
        console.log("SM-> premiums %s", premiums[0]);

        console.log(
            "SM-> Borrowd(flashloan) Balance %s",
            IERC20(assets[0]).balanceOf(address(this))
        );

        (
            vars._borrower,
            vars._repayAmount,
            vars._cTokenRepay,
            vars._cTokenCollateral
        ) = abi.decode(params, (address, uint256, address, address));

        console.log("SM -> vars._borrower %s", vars._borrower);
        console.log("SM -> vars._repayAmount %s", vars._repayAmount);
        console.log("SM -> vars._cTokenRepay %s", vars._cTokenRepay);
        console.log("SM -> vars._cTokenCollateral %s", vars._cTokenCollateral);

        IERC20(assets[0]).safeApprove(vars._cTokenRepay, vars._repayAmount);

        vars.liquidateBorrowError = CErc20Interface(vars._cTokenRepay)
            .liquidateBorrow(
                vars._borrower,
                vars._repayAmount,
                CTokenInterface(vars._cTokenCollateral)
            );

        console.log(
            "SM -> liquidateBorrowError %s ",
            vars.liquidateBorrowError
        );

        vars.seizedTokens = IERC20(vars._cTokenCollateral).balanceOf(
            address(this)
        );
        console.log("SM -> this seizedTokenBalance %s", vars.seizedTokens);

        vars.redeemErrorCode = CErc20Interface(vars._cTokenCollateral).redeem(
            vars.seizedTokens
        );
        console.log("SM ->redeemError %s", vars.redeemErrorCode);

        address siezedTokenUnderlying = CErc20Storage(
            address(vars._cTokenCollateral)
        ).underlying();
        console.log("SM -> siezedTokenUnderlying %s", siezedTokenUnderlying);

        vars.underlyingBalance = IERC20(siezedTokenUnderlying).balanceOf(
            address(this)
        );
        console.log("SM -> underlyingTokenBalance %s", vars.underlyingBalance);

        ////////////////////////////////////////////////////////
        ////////////////// UNISWAP  OPERATIONS /////////////////
        ////////////////////////////////////////////////////////

        address[] memory path = new address[](2);
        path[0] = siezedTokenUnderlying;
        path[1] = assets[0];

        // Approve For Uniswap Rowter
        IERC20(siezedTokenUnderlying).safeApprove(
            address(uniswapRouter),
            vars.underlyingBalance
        );

        vars.amountReceived = uniswapRouter.swapExactTokensForTokens(
            vars.underlyingBalance,
            0,
            path,
            address(this),
            block.timestamp + 60
        )[1];

        console.log("SM -> SWAP Amount Received: %s", vars.amountReceived);
        console.log(
            "SM -> ASSET Token Balance %s",
            IERC20(assets[0]).balanceOf(address(this))
        );

        // Approve the LendingPool contract allowance to *pull* the owed amount

        vars.amountOwing = amounts[0].add(premiums[0]);
        console.log("SM--> amountOwing: %s", vars.amountOwing);
        IERC20(assets[0]).safeApprove(address(LENDING_POOL), vars.amountOwing);

        return true;
    }

    function myFlashLoanCall(
        address _borrower,
        uint256 _repayAmount,
        address _cTokenRepay,
        address _cTokenCollateral
    ) public {
        console.log("SM-> Start Flashloan Call");

        bytes memory data = abi.encode(
            _borrower,
            _repayAmount,
            _cTokenRepay,
            _cTokenCollateral
        );

        // Get Lending Asset Address from cTokencontract (uinderlying)

        address lendingAsset;
        if (address(_cTokenRepay) == CETH_ADDRESS) {
            lendingAsset = ETH_RESERVE_ADDRESS;
        } else {
            lendingAsset = CErc20Storage(address(_cTokenRepay)).underlying();
        }

        console.log(">> Lending asset %s", lendingAsset);

        address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = lendingAsset; // Borrow repay amount

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _repayAmount;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = data;
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }
}

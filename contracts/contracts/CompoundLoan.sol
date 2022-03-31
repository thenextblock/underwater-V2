// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { CErc20Interface, CTokenInterface, CETHInterface } from "./Interfaces/CTokenInterfaces.sol";
import { IERC20 } from "./Interfaces/Interfaces.sol";
import { SafeERC20 } from "./Interfaces/Libraries.sol";
import { ComptrollerInterface } from "./Interfaces/ComptrollerInterface.sol";

// import "hardhat/console.sol";


contract CompoundLoan {
    using SafeERC20 for IERC20;

    address CETH_ADDRESS = 0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;
    ComptrollerInterface public comptroller; 

    constructor(address _comptroller) public {
        comptroller = ComptrollerInterface(_comptroller);
    }

    function enterMarkets(address[] memory _cTokens) public payable {
        // console.log("SM-> Enter Markets");
        // console.log("SM-> % Amount : ", msg.value);
        // console.log("SM-> This balance %s", address(this).balance);
        comptroller.enterMarkets(_cTokens);

        // Call Mint and send value need for cEth
        CETHInterface(_cTokens[0]).mint{value: msg.value}();
    }

    function getContractCTokenBalance(address _cToken) public view returns (uint256) {
        return CTokenInterface(_cToken).balanceOf(address(this));
    }

    function borrowAsset(address _cToken, uint256 _borrowAmount) public {   
        // CErc20Interface(_cToken).borrow(_borrowAmount);
        // address underLying = CErc20Interface(_cToken).underlying();
        // console.log("SM--> UnderLying Address %s", underLying);
        // uint256 underlyingBalance = IERC20(underLying).balanceOf(address(this));
        // console.log("SM->> UderlyingBalance: %s:", underlyingBalance);

        _borrowAssetInternal(_cToken, _borrowAmount);
    }

    function _borrowAssetInternal(address _cToken, uint256 _borrowAmount) internal returns (address, uint256) {   
        CErc20Interface(_cToken).borrow(_borrowAmount);
        address underLying = getUnderlyingAddress(_cToken);
        // console.log("SM--> UnderLying Address %s", underLying);
        uint256 underlyingBalance = IERC20(underLying).balanceOf(address(this));
        // console.log("SM->> UderlyingBalance: %s:", underlyingBalance);

        return (underLying, underlyingBalance);
    }

    // Liquidate: borrow asset is not an ether
    function liquidate(address _borrower, address _cTokenRepay, uint256 _repayAmount, address _cTokenCollateral) public {
        
        // First Borrow Assets to repay 
        (address undelyingAddress, uint256 balance) =  _borrowAssetInternal(_cTokenRepay, _repayAmount);
        // console.log( "SM--> BorrowedBalance %s",  balance);
        
        // Give cToken permission to take an Ammount ... 
        IERC20(undelyingAddress).safeApprove(_cTokenRepay, balance);

        // Liquidate ... 
        uint256 liquidateBorrowError = CErc20Interface(_cTokenRepay).liquidateBorrow
            (
                _borrower,
                _repayAmount,
                CTokenInterface(_cTokenCollateral)
            );

        // console.log("SM--> liquidateBorrowError: %s ", liquidateBorrowError);
        // console.log("collateral Address: %s", getUnderlyingAddress(_cTokenCollateral));

        address underlyingCollateral = getUnderlyingAddress(_cTokenCollateral);

        //////////// DONT FORGET REDEEEM !!!!! ///////
        /////////// REDEEEEEEM ///////////////////////
        //////////////////////////////////////////////

        // if(underlyingCollateral == address(0)) {
        //     console.log("SM--> Collatreal is Ethereum : Balance = ", address(this).balance);
        // }else{
        //     console.log("SM--> Collatreal is Token ", address(this).balance);
        //     (string memory name , uint256 balance ) = getUnderlyingTokenInfo(underlyingCollateral, address(this));
        //     console.log( "SM--> Token: %s Balance: %s", name, balance);
        // }
        
    }


    function getUnderlyingTokenInfo(address _tokenAddress, address _account) internal returns(string memory, uint256) {
        uint256 balance = IERC20(_tokenAddress).balanceOf(_account);
        string memory name = IERC20(_tokenAddress).name();
        return(name, balance);
    }

    function getUnderlyingAddress(address _cToken) internal returns(address) {
        if(_cToken == CETH_ADDRESS) {
            return address(0);
        } else {
            return CErc20Interface(_cToken).underlying();
        }
    }
}






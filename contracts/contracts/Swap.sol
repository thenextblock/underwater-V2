// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.6;

import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import { IERC20 } from "./Interfaces/IERC20.sol";


import "hardhat/console.sol";

contract Swap  {

    // https://github.com/Netswap/exchange-contracts Netswap !
    // address internal constant UNISWAP_V2_ROUTER = 0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56; 
    
    // Tethys
    // https://github.com/Tethys-Finance/tethys-contracts
    address internal constant UNISWAP_V2_ROUTER = 0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09; 
    
    address public factory;
    IUniswapV2Router02 public uniswapRouter;

     constructor(address _factory, address _uniswapRouter) public {
        factory = _factory;  
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
     }


    function startArbitrage(
        address token0, 
        address token1, 
        uint amount0, 
        uint amount1
    ) external {

        console.log("SM-> %s ", uniswapRouter.factory());
        IUniswapV2Factory factoryInstance = IUniswapV2Factory(uniswapRouter.factory());
        address pairAddress = factoryInstance.getPair(token0, token1);
        console.log("SM-> Pair address %s", pairAddress);
        
        require(pairAddress != address(0), "This pool does not exist");

        // IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        // console.log("SM-> %s")
        
        IUniswapV2Pair(pairAddress).swap(
                amount0, 
                amount1, 
                address(this), 
                bytes("not empty")
        );
  }

  function uniswapV2Call(
        address _sender, 
        uint _amount0, 
        uint _amount1, 
        bytes calldata _data
  ) external {

    address[] memory path = new address[](2);
    uint amountToken = _amount0 == 0 ? _amount1 : _amount0;
    
    address token0 = IUniswapV2Pair(msg.sender).token0();
    address token1 = IUniswapV2Pair(msg.sender).token1();
    

    console.log("SM-->  Funds arrived ");
    console.log("SM--> token0 %s", token0);
    console.log("SM--> token1 %s", token1);
    console.log("SM--> Token Balance : ", IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)));

    console.log("SM--> msg.sender %s", msg.sender);
    address pairFor = UniswapV2Library.pairFor(factory, token0, token1);
    console.log("SM--> pairFor: %s", pairFor);

    require(
      msg.sender == UniswapV2Library.pairFor(factory, token0, token1), 
      "Unauthorized"
    ); 
    
    require(_amount0 == 0 || _amount1 == 0);

    path[0] = _amount0 == 0 ? token1 : token0;
    path[1] = _amount0 == 0 ? token0 : token1;

    IERC20 token = IERC20(_amount0 == 0 ? token1 : token0);
    
    token.approve(address(uniswapRouter), amountToken);

    uint amountRequired = UniswapV2Library.getAmountsIn(
      factory, 
      amountToken, 
      path
    )[0];

    console.log("SM->> %s ", amountRequired);

    // uint amountReceived = sushiRouter.swapExactTokensForTokens(
    //   amountToken, 
    //   amountRequired, 
    //   path, 
    //   msg.sender, 
    //   deadline
    // )[1];

    // IERC20 otherToken = IERC20(_amount0 == 0 ? token0 : token1);
    // otherToken.transfer(msg.sender, amountRequired);
    // otherToken.transfer(tx.origin, amountReceived - amountRequired);

  }

}
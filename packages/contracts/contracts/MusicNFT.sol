// contracts/MusicNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// No Counters import

contract MusicNFT is ERC1155, Ownable {
    // Using a simple counter instead
    uint256 private _nextTokenId;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public creators;
    
    // Mapping from token ID to price in ETH
    mapping(uint256 => uint256) public prices;
    
    constructor() ERC1155("") Ownable(msg.sender) {}
    
    function mintMusicNFT(
        address to, 
        string memory tokenURI,
        uint256 amount,
        uint256 priceInWei
    ) public returns (uint256) {
        uint256 newTokenId = _nextTokenId++;
        
        _mint(to, newTokenId, amount, "");
        _tokenURIs[newTokenId] = tokenURI;
        creators[newTokenId] = msg.sender;
        prices[newTokenId] = priceInWei;
        
        return newTokenId;
    }
    
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function buyMusic(uint256 tokenId) public payable {
        require(msg.value >= prices[tokenId], "Insufficient payment");
        require(balanceOf(creators[tokenId], tokenId) > 0, "No copies available");
        
        // Transfer the token
        _safeTransferFrom(creators[tokenId], msg.sender, tokenId, 1, "");
        
        // Transfer payment to creator
        payable(creators[tokenId]).transfer(msg.value);
    }
}

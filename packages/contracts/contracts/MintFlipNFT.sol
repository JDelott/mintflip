// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintFlipNFT is ERC721URIStorage, Ownable {
    // In OpenZeppelin v5, Counters is no longer needed - we can use a simple uint256
    uint256 private _nextTokenId;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Royalty percentage (in basis points, 1/100 of a percent)
    // 500 = 5%
    uint256 public royaltyBasisPoints = 500;

    constructor() ERC721("MintFlip NFT", "MFNFT") Ownable(msg.sender) {}
    
    // Mint a new NFT
    function mintNFT(address recipient, string memory tokenURI) 
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set the creator
        _creators[tokenId] = msg.sender;
        
        return tokenId;
    }
    
    // Get the creator of an NFT
    function creatorOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _creators[tokenId];
    }
    
    // Check if a token exists
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // Set the royalty percentage (only owner)
    function setRoyaltyBasisPoints(uint256 _royaltyBasisPoints) public onlyOwner {
        require(_royaltyBasisPoints <= 1000, "Royalty too high"); // Max 10%
        royaltyBasisPoints = _royaltyBasisPoints;
    }
}

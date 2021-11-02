// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './ERC721Pausable.sol';

contract SquidArena is ERC721, ERC721Enumerable, Ownable, ERC721Pausable {
  bytes32 internal keyHash;
  uint256 internal fee;

  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  // Global vars
  string public baseTokenURI; // Base token URI

  // Constants
  uint256 public constant MAX_ELEMENTS = 1024; // Max number of tokens minted
  uint256 public constant PRICE = 8 * 10**16; // Price to mint a single token
  uint256 public constant MAX_BY_MINT = 5; // Max number of tokens to be minted in a single transaction

  constructor(string memory baseURI) ERC721('Squid Arena', 'SQUID') {
    keyHash = 0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445;
    fee = 2 * 10**18; // 2 LINK (Varies by network)
    setBaseURI(baseURI);
    pause(true);
  }

  modifier saleIsOpen() {
    require(_totalSupply() <= MAX_ELEMENTS, 'Sale end');
    if (_msgSender() != owner()) {
      require(!paused(), 'Pausable: paused');
    }
    _;
  }

  function _totalSupply() internal view returns (uint256) {
    return _tokenIdTracker.current();
  }

  function totalMint() public view returns (uint256) {
    return _totalSupply();
  }

  function mint(address _to, uint256 _count) public payable saleIsOpen {
    uint256 total = _totalSupply();
    require(total + _count <= MAX_ELEMENTS, 'Max limit');
    require(total <= MAX_ELEMENTS, 'Sale end');
    require(_count <= MAX_BY_MINT, 'Exceeds number');
    require(msg.value >= price(_count), 'Value below price');

    for (uint256 i = 0; i < _count; i++) {
      _mintAnElement(_to);
    }
  }

  function _mintAnElement(address _to) private {
    uint256 id = _totalSupply();
    _tokenIdTracker.increment();
    _safeMint(_to, id);
  }

  function price(uint256 _count) public pure returns (uint256) {
    return PRICE.mul(_count);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    baseTokenURI = baseURI;
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    return string(abi.encodePacked(baseTokenURI, Strings.toString(_tokenId)));
  }

  function walletOfOwner(address _owner) external view returns (uint256[] memory) {
    uint256 tokenCount = balanceOf(_owner);

    uint256[] memory tokensId = new uint256[](tokenCount);
    for (uint256 i = 0; i < tokenCount; i++) {
      tokensId[i] = tokenOfOwnerByIndex(_owner, i);
    }

    return tokensId;
  }

  function pause(bool val) public onlyOwner {
    if (val == true) {
      _pause();
    } else {
      _unpause();
    }
  }

  function _widthdraw(address _address, uint256 _amount) private {
    (bool success, ) = _address.call{value: _amount}('');
    require(success, 'Transfer failed');
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

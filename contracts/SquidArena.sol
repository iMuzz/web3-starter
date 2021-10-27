// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './ERC721Pausable.sol';

import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';

//   ██████   █████   █    ██  ██▓▓█████▄     ▄▄▄       ██▀███  ▓█████  ███▄    █  ▄▄▄
// ▒██    ▒ ▒██▓  ██▒ ██  ▓██▒▓██▒▒██▀ ██▌   ▒████▄    ▓██ ▒ ██▒▓█   ▀  ██ ▀█   █ ▒████▄
// ░ ▓██▄   ▒██▒  ██░▓██  ▒██░▒██▒░██   █▌   ▒██  ▀█▄  ▓██ ░▄█ ▒▒███   ▓██  ▀█ ██▒▒██  ▀█▄
//   ▒   ██▒░██  █▀ ░▓▓█  ░██░░██░░▓█▄   ▌   ░██▄▄▄▄██ ▒██▀▀█▄  ▒▓█  ▄ ▓██▒  ▐▌██▒░██▄▄▄▄██
// ▒██████▒▒░▒███▒█▄ ▒▒█████▓ ░██░░▒████▓     ▓█   ▓██▒░██▓ ▒██▒░▒████▒▒██░   ▓██░ ▓█   ▓██▒
// ▒ ▒▓▒ ▒ ░░░ ▒▒░ ▒ ░▒▓▒ ▒ ▒ ░▓   ▒▒▓  ▒     ▒▒   ▓▒█░░ ▒▓ ░▒▓░░░ ▒░ ░░ ▒░   ▒ ▒  ▒▒   ▓▒█░
// ░ ░▒  ░ ░ ░ ▒░  ░ ░░▒░ ░ ░  ▒ ░ ░ ▒  ▒      ▒   ▒▒ ░  ░▒ ░ ▒░ ░ ░  ░░ ░░   ░ ▒░  ▒   ▒▒ ░
// ░  ░  ░     ░   ░  ░░░ ░ ░  ▒ ░ ░ ░  ░      ░   ▒     ░░   ░    ░      ░   ░ ░   ░   ▒
//       ░      ░       ░      ░     ░             ░  ░   ░        ░  ░         ░       ░  ░
//                                 ░

// Squid game is a smart contract that programs a deflationary NFT, implemented as a game.
// In this game, there will be n rounds and 2**n tokens.
// Each round, a random 50% of the tokens will be burned.
// After the last round, there will be one token remaining, and the owner will be able to
// claim the treasury, which consists of the mint price paid for each token.

contract SquidArena is ERC721, ERC721Enumerable, Ownable, ERC721Pausable, VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;
  uint256 public randomResult;

  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;

  // Defines the different stages of the game
  enum GameState {
    PREMINT, // Before the game, when minting is not available yet.
    MINTING, // Before the game, when minting is available to the public.
    STARTED, // During one of the rounds of the game.
    FINISHED // After the game, when there is a winner.
  }

  // Global vars
  bool private _isAdminBurnEnabled = false; // Flag to indicate whether the admin should be able to burn the supply
  bool private creatorHasClaimed = false; // Flag to indicate whether the creator has claimed reward
  uint256 public currentRound = 0; // Tracks the current round
  uint256 public currentBurn = 0; // Tracks the number of burns that have been requested so far
  string public baseTokenURI; // Base token URI
  address public winnerAddress; // The address of the winner of the game
  GameState public gameState; // The current state of the game

  // Constants
  uint256 public constant NUM_ROUNDS = 7; // Number of rounds this game will last
  uint256 public constant MAX_ELEMENTS = 2**NUM_ROUNDS; // Max number of tokens minted
  uint256 public constant PRICE = 8 * 10**16; // Price to mint a single token
  uint256 public constant MAX_BY_MINT = 5; // Max number of tokens to be minted in a single transaction
  uint256 public constant CREATOR_PERCENTAGE = 20; // Percentage given to creators

  constructor(string memory baseURI)
    ERC721('Squid Arena', 'SQUID')
    VRFConsumerBase(
      0xf0d54349aDdcf704F77AE15b96510dEA15cb7952, // VRF Coordinator (Kovan)
      0x514910771AF9Ca656af840dff83E8264EcF986CA // LINK Contract Token (Kovan)
    )
  {
    keyHash = 0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445;
    fee = 2 * 10**18; // 2 LINK (Varies by network)
    setBaseURI(baseURI);
    pause(true);
    gameState = GameState.PREMINT;
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
      gameState = GameState.PREMINT;
    } else {
      _unpause();
      gameState = GameState.MINTING;
    }
  }

  // This is a last resort fail safe function.
  // If for any reason the contract doesn't sell out
  // or needs to be shutdown. This allows the administrators
  // to be able to to withdraw all funds from the contract
  // so that it can be disbursed back to the original minters
  function pullRug() public payable onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0);
    _widthdraw(owner(), address(this).balance);
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
    /* While the burn is happening, disable token transfers for all users
     *  other than the admin. The admin needs transfer privilages during
     *  the burn because burning is *technically* a transfer between owner
     *  of the NFT -> the NULL Address.
     **/
    if (_msgSender() != owner()) {
      require(currentRound == currentBurn, 'disabled');
    }

    super._beforeTokenTransfer(from, to, tokenId);
  }

  function startBurn() public onlyOwner {
    if (currentRound == 0) {
      require(totalSupply() == MAX_ELEMENTS, 'Not all tokens minted');
    }
    require(totalSupply() > 1, 'Game finished');
    _getRandomNumber();
  }

  /**
   * Claim winner:
   * - Requires creatorHasClaimed to be true
   * - Requires 1 token to be left
   * - Requires creator to have
   * - Withdraws the rest of the balance to contract owner
   */
  function claimWinnerReward() public {
    require(creatorHasClaimed == true, 'Creator reward not claimed');
    require(totalSupply() == 1, 'Game not finished');
    require(_msgSender() == winnerAddress, 'Not winner');
    _widthdraw(winnerAddress, address(this).balance);
  }

  /**
   * Claim creator:
   * - Requires creatorHasClaimed to be false
   * - Withdraws CREATOR_PERCENTAGE / 100 * POT to contract owner
   * - Sets creatorHasClaimed to true
   */
  function claimCreatorReward() public onlyOwner {
    require(creatorHasClaimed == false, 'Creator reward claimed');
    uint256 balance = address(this).balance;
    uint256 creatorReward = SafeMath.mul(SafeMath.div(balance, 100), CREATOR_PERCENTAGE);
    _widthdraw(owner(), creatorReward);
    creatorHasClaimed = true;
  }

  /**
   * Requests randomness
   */
  function _getRandomNumber() internal returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= fee, 'Not enough LINK');
    // Increment the current burn
    currentBurn += 1;
    return requestRandomness(keyHash, fee);
  }

  /**
   * Callback function used by VRF Coordinator
   */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = randomness;

    // Since Chainlink has provided a verifiably random value,
    // that can be used for the burn, let the admin burn the supply.
    _isAdminBurnEnabled = true;
  }

  uint256[] tokensToBurn;

  function burnSupply() public onlyOwner {
    require(_isAdminBurnEnabled, 'Burn disabled');
    require(totalSupply() > 1, 'Game is over');

    uint256 startingIndex = randomResult % 2;
    // The first burn should turn the game state to started.
    gameState = GameState.STARTED;

    uint256 currentSupplyLength = totalSupply();

    // Create an array of tokens to burn
    // (skipping every other item starting from startingIndex)
    for (uint256 index = startingIndex; index < currentSupplyLength; index += 2) {
      tokensToBurn.push(tokenByIndex(index));
    }
    // Burns all tokens in array
    for (uint256 i = 0; i < tokensToBurn.length; i++) {
      _burn(tokensToBurn[i]);
    }
    // Increment to the next round
    currentRound += 1;

    // If we have a winner, set the current winner field to the address
    // of the owner that owns the last remaining NFT.
    if (totalSupply() == 1) {
      winnerAddress = ownerOf(tokenByIndex(0));

      // Turn the game state to finished.
      gameState = GameState.FINISHED;
    }

    // clean up after yourself
    delete tokensToBurn;
    // After a burn is completed, disable the admin from
    // triggering another burn
    _isAdminBurnEnabled = false;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

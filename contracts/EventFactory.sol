// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventFactory is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
    Counters.Counter public eventIdCounter;

    struct EventData {
        uint16 price;
        string name;
    }

    mapping(uint256 => EventData) public idToEvent;

    //pocetak funkcija
    constructor() ERC721("Showstarter Events", "SHOW") {}

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3000/";
    }

    function createEvent(EventData calldata _eventData) external {
        eventIdCounter.increment();
        EventData memory eventData = _eventData;
        idToEvent[eventIdCounter.current()] = eventData;
        console.log("Event created");
        emit EventCreated(uint256(eventIdCounter.current()));
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}

    //event declarations

    event EventCreated(uint256 eventId);
}

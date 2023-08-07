//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "./IEventImplementation.sol";

contract EventImplementation is
    Initializable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    IEventImplementation
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    EventData public eventData;
    mapping(string => Ticket) public tickets;

    // Locking implementation contract after deployment in order to protect it from attacks
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _eventName,
        string memory _eventSymbol
    ) external payable initializer {
        __Ownable_init();
        __ERC721_init(_eventName, _eventSymbol);
        console.log(
            "%s name service deployed. Symbol: %s",
            _eventName,
            _eventSymbol
        );
    }

    function setEventData(EventData calldata _eventData) external {
        // ocito mogu samo assign struct na struct jer su istog tipa?
        eventData = _eventData;
        console.log("usao u setEventData");
    }

    function setTicketData(
        string[] memory ticketTypes,
        uint[] memory supplies,
        uint[] memory prices
    ) external {
        for (uint256 i = 0; i < ticketTypes.length; i++) {
            tickets[ticketTypes[i]] = Ticket(supplies[i], prices[i]);
        }
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}

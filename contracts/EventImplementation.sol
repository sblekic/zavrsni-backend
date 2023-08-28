//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
// ugovor potreban za transfer tokena na samom ugovoru
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

import "./IEventImplementation.sol";

contract EventImplementation is
    Initializable,
    ERC721Upgradeable,
    ERC721HolderUpgradeable,
    OwnableUpgradeable,
    IEventImplementation
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    EventData public eventData;
    mapping(string => Ticket) public tickets;
    // vrati na private kad si gotov
    mapping(uint256 => ListedTicket) public idToListedTicket;

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

    function safeMint(address to) internal {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        string memory base = "https://showstarter.netlify.app/tickets/";
        string memory proxyAddress = StringsUpgradeable.toHexString(
            address(this)
        );

        return string(abi.encodePacked(base, proxyAddress, "/"));
    }

    function buyTicket(string calldata ticketType) external payable {
        require(tickets[ticketType].supply > 0, "Ulaznice su rasprodane");
        require(
            msg.value == tickets[ticketType].price,
            "Nedovoljan iznos za kupnju ulaznice"
        );
        safeMint(msg.sender);
        tickets[ticketType].supply--;
        emit TicketSale(address(this), _tokenIdCounter.current());
    }

    //dodaj ticketType kao param kako bis mogao ograničiti cijenu preprodaje
    function sellTicket(
        uint256 tokenId,
        uint256 resellPrice,
        string calldata ticketType
    ) external {
        require(
            resellPrice <= tickets[ticketType].price,
            "Cijena preprodaje ne smije biti veca od originalne cijene ulaznice"
        );
        idToListedTicket[tokenId] = ListedTicket(
            tokenId,
            payable(msg.sender),
            resellPrice
        );
        safeTransferFrom(msg.sender, address(this), tokenId);
        emit ListedTicketSuccess(tokenId);
    }

    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}

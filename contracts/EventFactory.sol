//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IEventImplementation.sol";

contract EventFactory {
    using Counters for Counters.Counter;
    Counters.Counter private eventId;

    // svaka instanca beaconProxya pita ovog beacona gdje se nalazi impl ugovor za delegaciju
    // funkcijskih poziva. Ako upgradeableBeaconu promjenim adresu implementacijskog ugovora,
    // faktički nadogradim svaki deployani beacon proxy jer svi traže implementaciju ovdje
    UpgradeableBeacon immutable beacon;

    constructor(address _eventLogic) {
        //beacon = new ShipBeacon(_initBlueprint);
        beacon = new UpgradeableBeacon(_eventLogic);
        // moram prebaciti ownership na sebe kako bih mogao promijeniti adresu beacona (impl contract v2)
        // ako ovo ne napravim ugovor će biti vlasnik pa neću moći pozvati određene funkcije
        beacon.transferOwnership(msg.sender);
    }

    //vjerojatno dohvacati u fn adresu eventOrganizera tako da ga se moze
    //postaviti kao owner eventa u eventImplementation ugovor putem transferOwnership
    //ovo mi je bitno tako da mogu dohvatiti svi eventi registrirani sa strane organizatora (nekakav dash)
    //tehnički ovaj ugovor kreira proxy i po ownableUpgradeable docs on postaje po defaultu owner (testirano i tocno)
    function createEvent(
        IEventImplementation.EventData memory _eventData,
        string[] memory ticketTypes,
        uint[] memory supplies,
        uint[] memory prices
    ) external returns (address) {
        eventId.increment();
        // moram još vidjeti kako će mintanje funkcionirati
        string memory tokenName = string.concat(
            "Showstarter Event ",
            Strings.toString(eventId.current())
        );

        bytes memory eventCalldata = abi.encodeWithSignature(
            "initialize(string,string)",
            tokenName,
            "SHOW"
        );
        // deploy novog ugovora za event
        BeaconProxy eventProxy = new BeaconProxy(
            address(beacon),
            eventCalldata
        );

        // interface koristim zbog toga što ne moram kodirati funkciju setEventData sa abi.encodeWithSignature. Importiran je interface, dakle ovaj ugovor
        // zna da postoji funkcija koja se zove setEventdata i očekuje struct. Da nemam importiran interface moram objasniti ovom ugoovoru
        // da na adresi eventProxy-a (ugovor eventa kojeg sam deploy-a) postoji funkcija za postavljanje event data. To se radi sa low level call,
        // odnosno na određenu adresu pozivam function selector sa određenim parameterima - abi.encodeWithSignature.abi
        // razlog zasto ne importirati interface bi bio jedino ako zelim usparati na gas

        IEventImplementation(address(eventProxy)).setEventData(_eventData);
        IEventImplementation(address(eventProxy)).setTicketData(
            ticketTypes,
            supplies,
            prices
        );

        emit EventCreated(address(eventProxy));
        // da li uopce mora ista vracati? ako ne planiram ovaj podatak koristiti u drugom ili u ovom ugovoru, onda ne.
        // ovdje ono što sam htio postići je bilo dohvaćanje adrese ugovora na frontu. Pravilan način za to postići je emitati event
        return address(eventProxy);
    }

    function getEventBeacon() external view returns (address) {
        return address(beacon.implementation());
    }

    receive() external payable {}

    // * fallback function
    fallback() external payable {}

    event EventCreated(address);
}

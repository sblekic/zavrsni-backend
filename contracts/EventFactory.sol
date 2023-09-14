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

    UpgradeableBeacon immutable beacon;

    constructor(address _eventLogic) {
        beacon = new UpgradeableBeacon(_eventLogic);
        beacon.transferOwnership(msg.sender);
    }

    function createEvent(
        IEventImplementation.EventData memory _eventData,
        string[] memory ticketTypes,
        uint[] memory supplies,
        uint[] memory prices
    ) external returns (address) {
        eventId.increment();
        string memory tokenName = string.concat(
            "Showstarter Event ",
            Strings.toString(eventId.current())
        );

        bytes memory eventCalldata = abi.encodeWithSignature(
            "initialize(string,string)",
            tokenName,
            "SHOW"
        );

        BeaconProxy eventProxy = new BeaconProxy(
            address(beacon),
            eventCalldata
        );

        IEventImplementation eventInterface = IEventImplementation(
            address(eventProxy)
        );
        eventInterface.setEventData(_eventData);
        eventInterface.setTicketData(ticketTypes, supplies, prices);
        eventInterface.setOrganizer(msg.sender);

        emit EventCreated(address(eventProxy));
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

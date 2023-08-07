//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IEventImplementation {
    struct EventData {
        string name;
        uint32 start;
        uint32 end;
    }

    struct Ticket {
        uint supply;
        uint price;
    }

    function setEventData(EventData memory _eventData) external;

    function setTicketData(
        string[] memory ticketTypes,
        uint[] memory supplies,
        uint[] memory prices
    ) external;
}

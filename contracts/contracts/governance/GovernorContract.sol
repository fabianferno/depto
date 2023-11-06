// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    struct Application {
        address applierAddress;
        string metadata;
        uint timestamp;
        bool isHandled;
    }

    uint public treasury;

    mapping(uint => Application) applications;
    uint public applicationsPointer;

    mapping(uint => uint) proposalsToProposalId;
    uint public proposalsPointer;

    mapping(address => mapping(uint => bool)) public verifierToApplication;
    mapping(address => mapping(uint => bool)) public claimerToClaims;

    uint256 public constant APPLICATION_FEE = 200000000000000; // 0.0002 ether

    event PatentApplied(
        uint indexed applicationId,
        address applicant,
        string metadata,
        uint timestamp
    );

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _votingDelay
    )
        Governor("GovernorContract")
        GovernorSettings(
            _votingDelay, /* 1 block */ // voting delay
            _votingPeriod, // 45818, /* 1 week */ // voting period
            0 // proposal threshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {
        proposalsPointer = 0;
        applicationsPointer = 0;
        treasury = 0;
    }

    function applyPatent(string calldata metadataURI) public payable {
        require(msg.value >= APPLICATION_FEE, "Insufficient Fee");
        treasury += msg.value - APPLICATION_FEE;
        applications[applicationsPointer] = Application(
            msg.sender,
            metadataURI,
            block.timestamp,
            false
        );
        applicationsPointer += 1;
    }

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, Governor)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function getProposals()
        public
        view
        returns (ProposalState[] memory _allProposals)
    {
        for (uint i = 0; i < proposalsPointer; i++) {
            _allProposals[i] = state(proposalsToProposalId[proposalsPointer]);
        }
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        uint _proposalId = super.propose(
            targets,
            values,
            calldatas,
            description
        );
        proposalsToProposalId[proposalsPointer] = _proposalId;
        proposalsPointer += 1;
        return _proposalId;
    }

    function proposalThreshold()
        public
        pure
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return uint256(5);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

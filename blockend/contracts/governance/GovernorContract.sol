// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "../Depto.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorTimelockControl
{
    struct DAOMember {
        string name;
        address walletAddress;
        uint joinedAt;
        uint leftAt;
    }

    struct Application {
        address walletAddress;
        string metadata;
        uint appliedOn;
    }

    struct FalseClaim {
        address claimerWalletAddress;
        uint applierTokenId;
        uint falsePatentTokenId;
        string metadata;
        uint claimedOn;
    }

    struct Votes {
        uint againstVotes;
        uint forVotes;
        uint abstainVotes;
    }

    struct Proposal {
        uint proposalId;
        string description;
        ProposalState state;
        Votes votes;
    }

    uint public treasury;
    uint public quorumPercentage;

    DAOMember[] daoMembers;
    mapping(address => uint) public addressToDaoMembers;
    uint public daoMemberCount;

    uint[] public allProposals;
    string[] public proposalsDescription;

    mapping(uint => Application) applications;
    uint public applicationsPointer;
    mapping(uint => bool) isApplicationHandled;

    mapping(uint => FalseClaim) falseClaims;
    uint public falseClaimPointer;
    mapping(uint => bool) isFalseClaimHandled;

    mapping(address => uint[]) daoMemberToApplications;
    mapping(address => uint[]) daoMemberToFalseClaims;
    mapping(address => bool) public isDAOMember;

    TimelockController timelockController;

    mapping(address => uint256[]) public userToPatentClaims;
    mapping(address => uint256[]) public userToFalseClaims;

    uint256 public constant PROPOSAL_FEE = 2000000000000000000;
    uint256 public constant FALSE_CLAIM_FEE = 1000000000000000000;

    constructor(
        string memory deployerName,
        TimelockController _timelock,
        uint256 _votingPeriod,
        uint256 _votingDelay,
        uint256 _quorumPercentage
    )
        payable
        Governor("GovernorContract")
        GovernorSettings(
            _votingDelay, /* 1 block */ // voting delay
            _votingPeriod, // 45818, /* 1 week */ // voting period
            0 // proposal threshold
        )
        GovernorTimelockControl(_timelock)
    {
        timelockController = _timelock;
        quorumPercentage = _quorumPercentage;
        treasury += msg.value;
        addressToDaoMembers[msg.sender] = daoMembers.length;
        daoMembers.push(
            DAOMember(deployerName, msg.sender, block.timestamp, 0)
        );
        daoMemberCount = 1;
        isDAOMember[msg.sender] = true;
    }

    modifier checkDAOMember(address caller) {
        require(
            isDAOMember[caller],
            "GovernorContract: Only DAO members can access this function"
        );
        _;
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

    function quorum() public view override(IGovernor) returns (uint256) {
        return (quorumPercentage * daoMemberCount) / 100;
    }

    // The following functions are overrides required by Solidity.

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function addDAOMember(address newMember, string memory name) public {
        require(
            msg.sender == address(timelockController),
            "TimeLock can only invoke this function"
        );
        addressToDaoMembers[msg.sender] = daoMembers.length;
        daoMembers.push(DAOMember(name, newMember, block.timestamp, 0));
        daoMemberCount += 1;
        isDAOMember[newMember] = true;
    }

    function applyPatent(string memory metadataURI) public payable {
        require(
            msg.value >= PROPOSAL_FEE,
            "Insufficient Fee to apply for a patent"
        );
        treasury += msg.value - PROPOSAL_FEE;
        applications[applicationsPointer] = Application(
            msg.sender,
            metadataURI,
            block.timestamp
        );
        userToPatentClaims[msg.sender].push(applicationsPointer);

        applicationsPointer += 1;
    }

    function applyFalseClaim(
        uint applierPatentTokenId,
        uint falsePatentTokenId,
        string memory metadataURI
    ) public payable {
        require(
            msg.value >= FALSE_CLAIM_FEE,
            "Insufficient Funds for False Claim"
        );
        treasury += msg.value - FALSE_CLAIM_FEE;

        falseClaims[falseClaimPointer] = FalseClaim(
            msg.sender,
            applierPatentTokenId,
            falsePatentTokenId,
            metadataURI,
            block.timestamp
        );
        userToFalseClaims[msg.sender].push(falseClaimPointer);
        falseClaimPointer += 1;
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(Governor, IGovernor)
        checkDAOMember(msg.sender)
        returns (uint256)
    {
        uint proposalId = super.propose(
            targets,
            values,
            calldatas,
            description
        );
        allProposals.push(proposalId);
        proposalsDescription.push(description);
    }

    function leaveDAO() public checkDAOMember(msg.sender) {
        isDAOMember[msg.sender] = false;
        daoMembers[addressToDaoMembers[msg.sender]].leftAt = block.timestamp;

        uint funds = treasury / daoMemberCount;
        daoMemberCount -= 1;
        (bool success, bytes memory data) = payable(msg.sender).call{
            value: funds
        }("");
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
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

    function getAllDaoMembers()
        public
        view
        returns (DAOMember[] memory _daoMembers)
    {
        uint j = 0;
        for (uint256 i = 0; i < daoMembers.length; i++) {
            if (daoMembers[i].leftAt == 0) {
                _daoMembers[j] = daoMembers[i];
                j += 1;
            }
        }
    }

    function getPatentClaims(address user)
        public
        view
        returns (Application[] memory _applications)
    {
        uint j = 0;
        for (uint i = 0; i < applicationsPointer; i++) {
            if (isApplicationHandled[i] == false) {
                _applications[j] = applications[i];
                j += 1;
            }
        }
    }

    function getFalseClaims(address user)
        public
        view
        returns (FalseClaim[] memory _falseClaims)
    {
        uint j = 0;

        for (uint i = 0; i < falseClaimPointer; i++) {
            if (isFalseClaimHandled[i] == false) {
                _falseClaims[j] = falseClaims[i];
                j += 1;
            }
        }
    }

    function getAllProposals()
        public
        view
        returns (Proposal[] memory _proposals)
    {
        for (uint i = 0; i < allProposals.length; i++) {
            uint _proposal = allProposals[i];
            (
                uint _againstVotes,
                uint _forVotes,
                uint _abstainVotes
            ) = proposalVotes(allProposals[i]);
            _proposals[i] = Proposal(
                _proposal,
                proposalsDescription[i],
                state(_proposal),
                Votes(_againstVotes, _forVotes, _abstainVotes)
            );
        }
    }
}

# DEPTO
A decentralized patent provisioning DAO for secure and transparent verification and storage of patent applications.

<strong>Built for FVM Space Warp 2023 💫<strong> | 
@fabianferno
@gabrielantonyxavior
@pintoinfant


DEPTO CONTRACTS: https://github.com/gabrielantonyxaviour/depto_contracts
 
LIVE DEMO: https://depto.fabianferno.com

## Introduction
![image](https://user-images.githubusercontent.com/57835412/217038016-87c55cec-fea8-4717-a2d6-e2e1d907f923.png)


Depto is a platform that replaces traditional patent verification and storage procedures with a decentralized, community-driven approach. It uses blockchain technology to ensure the security and transparency of patent applications and their verification process. The platform consists of three smart contracts: the Depto contract, the Governor Contract, and the TimeLock contract.

![image](https://user-images.githubusercontent.com/57835412/217038136-4e3301a3-3869-4128-a047-fb088fe57a4f.png)
![image](https://user-images.githubusercontent.com/57835412/217038184-0930b3e0-65d4-4516-851b-7c136626e6ac.png)
![image](https://user-images.githubusercontent.com/57835412/217038203-5a24345d-9dd0-4a30-a10b-5d069efb9244.png)


## Features
- Patent applications are verified by DAO members and minted as NFTs to the applicants.
- DAO members are incentivized for verification and validation of patent applications.
- Anyone can raise false claims or inspection of patent proposals in the platform.
- Secure communication among DAO members using Huddle video conferencing SDK.
- Push notifications for updates on patent applications and verification process.
- Decentralized governance logic and proposals handled by the Governor Contract.
- Automated minting of ERC721 NFTs for verified patents.
- Deployed using Spheron on the mainnet.

## Technical details
- Built using Openzeppelin for smart contract development and governance.
- Modified Openzeppelin governance for access-based voting instead of token-based voting.
- Used ZondaxAPI contracts for fetching Deal Provider and Commitment data for SPs to claim rewards.
- Frontend built using NextJS and TailwindCSS.
- Interacts with smart contracts using ethers.js library.

![image](https://user-images.githubusercontent.com/57835412/217038240-5d5d4155-7a2f-4ca8-8ea2-4d84e8ae3a46.png)
![image](https://user-images.githubusercontent.com/57835412/217038317-c9bf7449-03f5-4cec-aa4c-35f638c89f29.png)


## Usage
1. Patent applicants apply for a patent through the platform.
2. A DAO member verifies the authenticity of the application and creates a patent document.
3. The DAO member creates a proposal with the patent document's raw CID.
4. The verified patent is voted on and validated by other DAO members.
5. The validated patent is stored as a storage deal by a Storage Provider (SP).
6. The SP claims his rewards and the patent NFT is minted to the patent applicant.

![Screenshot 2023-02-05 225236](https://user-images.githubusercontent.com/57835412/217434327-111605c4-dab1-49e4-8e91-35c04264617c.png)
![Screenshot 2023-02-05 225155](https://user-images.githubusercontent.com/57835412/217434339-1ed6d1ff-f7cf-461e-87a2-5682ad0a63f8.png)
![Screenshot 2023-02-05 225216](https://user-images.githubusercontent.com/57835412/217434353-7ab12bc6-43be-419b-92f7-d6772066349e.png)

# Contract Flows
```
Governor Contract (DAO)
mapping(address=>bool) isDAOMember - Is checked true when a member is added to the DAO.
mapping(address=>uint256[]) userToPatentClaims - maps the user to all dealIDs created by the user.
proposePatent(payable)  - callable by anyone, even members of DAO. On call, a new patent request is created. Which will be verified and voted by the DAO. Mints a claim NFT to the proposer as a proof of application.
raiseFalsePatentClaim(payable) - callable by anyone. It checks the date of both claims… if not valid, rejects. On successful claim, the money is returned. Or else is retained by the DAO.
execute - callable by anyone. Executes the proposal
proposeNewMember - Callable only by members of the DAO. On successful vote, a new member is added to the DAO.
voteProposal - callable only by members of the DAO. Each vote has only 1 weight no matter how many tokens you hold.

listPatents - callable by anyone, lists DAO approved patents.
 
```


## Contributions
We welcome contributions to the development of Depto. If you have any ideas or suggestions, feel free to open an issue or submit a pull request.

## License
Depto is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

import Head from 'next/head'
import { NFTStorage } from 'nft.storage'

import { useState, useEffect } from 'react'

import { BasicLayout } from '@/components/BasicLayout'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function CreatePatent() {
  const [acknowledge, setAcknowledge] = useState(false)
  const [metadataUrl, setMetadataUrl] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingPatent, setUploadingPatent] = useState(false)
  const [patent, setPatent] = useState({
    title: '',
    classNo: '',
    organization: '',
    nationality: '',
    description: '',
    category: 'individual',
    domain: '',
    previousId: '',
    email: '',
    mobile: '',
    country: 'India',
    street: '',
    city: '',
    state: '',
    zip: '',
    attachment: '',
    attachmentCid: '',
  })

  const { config } = usePrepareContractWrite({
    address: '0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37',
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'mint',
    args: [metadataUrl],
    enabled: Boolean(metadataUrl),
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const client = new NFTStorage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFkNDIyMzUxMzA4ZWVFOTA0MGFCZmU0ZWI2YTgyQUZCQ2JlNzAyZDAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTYyNzA5MDgxNCwibmFtZSI6ImRlcHRvIn0.7dnLVH2haC29EbX8fKxJ2b-I_v9uAaaAqaY5-EnGKzo',
  })

  async function uploadImage(event) {
    setUploading(true)
    const file = event.target.files[0]

    // Store file as a blob
    const cid = await client.storeBlob(file)

    setAttachment(file.name)
    setPatent({
      ...patent,
      attachment: file.name,
      attachmentCid: cid,
    })
    setUploading(false)
  }

  async function uploadPatent() {
    setUploadingPatent(true)
    const cid = await client.storeBlob(
      new Blob(
        [
          JSON.stringify(
            { ...patent, date: new Date().toISOString() },
            null,
            2
          ),
        ],
        { type: 'application/json' }
      )
    )
    setMetadataUrl('ipfs://' + cid)
    setUploadingPatent(false)
  }

  return (
    <>
      <Head>
        <title>Create Patent - DEPTO</title>
      </Head>
      <BasicLayout title="Patent Application Form (Section 5/44)">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    {/* <p className="mt-1 text-sm text-gray-600">
                      {JSON.stringify(patent, null, 2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Metadata URL {JSON.stringify(metadataUrl, null, 2)}
                    </p> */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Patent Title
                        </label>
                        <input
                          value={patent.title}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              title: e.target.value,
                            })
                          }
                          type="text"
                          id="title"
                          autoComplete="title"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="classNo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Class Number
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            0X-
                          </span>
                          <input
                            value={patent.classNo}
                            onChange={(e) =>
                              setPatent({
                                ...patent,
                                classNo: e.target.value,
                              })
                            }
                            type="number"
                            id="classNo"
                            autoComplete="classNo"
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="04, 06, etc"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Refer the class details
                          <a
                            href="https://ipindiaonline.gov.in/tmrpublicsearch/classfication_goods_service.htm"
                            target={'blank'}
                            className="relative cursor-pointer rounded-md bg-white pl-1 font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            here.
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="organization"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Organization
                      </label>
                      <input
                        type="text"
                        id="organization"
                        value={patent.organization}
                        onChange={(e) =>
                          setPatent({
                            ...patent,
                            organization: e.target.value,
                          })
                        }
                        autoComplete="organization"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="nationality"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nationality
                      </label>
                      <input
                        type="text"
                        id="nationality"
                        autoComplete="nationality"
                        value={patent.nationality}
                        onChange={(e) =>
                          setPatent({
                            ...patent,
                            nationality: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        autoComplete="description"
                        type="text"
                        value={patent.description}
                        onChange={(e) =>
                          setPatent({
                            ...patent,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <fieldset>
                      <legend className="contents text-base font-medium text-gray-900">
                        Category of applicants
                      </legend>
                      <p className="text-sm text-gray-500">
                        This affects the process of your patent approval.
                      </p>
                      <div className="mt-4 space-y-4">
                        <select
                          id="category"
                          name="category"
                          value={patent.category}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              category: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="individual">Individual</option>
                          <option value="startup">Startup</option>
                          <option value="corporate">Corporate</option>
                          <option value="others">Others</option>
                        </select>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Service Information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="domain"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Design Domain
                        </label>
                        <input
                          value={patent.domain}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              domain: e.target.value,
                            })
                          }
                          type="text"
                          autoComplete="domain"
                          id="domain"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="previousId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          If previous application exists, enter ID
                        </label>
                        <input
                          type="text"
                          value={patent.previousId}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              previousId: e.target.value,
                            })
                          }
                          id="previousId"
                          autoComplete="previousId"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={patent.email}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              email: e.target.value,
                            })
                          }
                          autoComplete="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="mobile"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mobile Number
                        </label>
                        <input
                          type="number"
                          id="mobile"
                          autoComplete="mobile"
                          value={patent.mobile}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              mobile: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          With country code.
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          autoComplete="country"
                          value={patent.country}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              country: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>India</option>
                          <option>United States</option>
                          <option>Others</option>
                        </select>
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Street address
                        </label>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          autoComplete="street"
                          value={patent.street}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              street: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="city"
                          value={patent.city}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          autoComplete="state"
                          value={patent.state}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              state: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="postal-code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP / Postal code
                        </label>
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          value={patent.zip}
                          onChange={(e) =>
                            setPatent({
                              ...patent,
                              zip: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Declaration & Attachments
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  To be signed by the applicant or by authorized agent.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <fieldset>
                      <div className=" space-y-4">
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              value={patent.acknowledge}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAcknowledge(true)
                                } else {
                                  setAcknowledge(false)
                                }
                              }}
                              id="acknowledge"
                              name="acknowledge"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="acknowledge"
                              className="font-medium text-gray-700"
                            >
                              Acknowledge
                            </label>
                            <p className="text-gray-500">
                              The applicant claims to be the proprietor(s) of
                              the design and that to the best of his knowledge
                              and belief the design is new or original.
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Document Attachments
                      </label>

                      {attachment && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 rounded-md border border-gray-200"
                        >
                          <li
                            key="attachment"
                            className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                          >
                            <div className="flex w-0 flex-1 items-center">
                              <PaperClipIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              <span className="ml-2 w-0 flex-1 truncate">
                                {attachment}
                              </span>
                            </div>
                          </li>
                        </ul>
                      )}

                      <div
                        className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 ${
                          uploading ? 'animate-pulse' : ''
                        }`}
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="attachment"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="attachment"
                                name="attachment"
                                type="file"
                                onChange={(e) => {
                                  uploadImage(e)
                                }}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, PDF, ZIP up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      disabled={!acknowledge}
                      type="button"
                      onClick={() => {
                        uploadPatent(patent)
                      }}
                      className={`mr-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-100 ${
                        uploadingPatent ? 'animate-pulse' : ''
                      }`}
                    >
                      Upload Data
                    </button>
                    <button
                      disabled={metadataUrl === ''}
                      type="button"
                      onClick={() => write?.()}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-100`}
                    >
                      {isLoading ? 'Minting Patent...' : 'Mint Patent'}
                    </button>
                    {isSuccess && (
                      <div>
                        Successfully minted your NFT!
                        <div>
                          <a href={`https://etherscan.io/tx/${data?.hash}`}>
                            Etherscan
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </BasicLayout>
    </>
  )
}

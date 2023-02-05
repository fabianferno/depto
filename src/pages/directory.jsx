import Head from 'next/head'
import Link from 'next/link'
import { LinkIcon } from '@heroicons/react/20/solid'
import { BasicLayout } from '@/components/BasicLayout'

const patent = {
  title: 'Wrist Band Sanitizer Spray Apparatus',
  organization: 'TVS Motor Company Limited',
  date: '22/06/2020',
  designNo: '2020-0001',
  classNo: '28-99',
  domain: 'Automobiles',
  email: 'ram@hsbcasas.com',
  mobile: '1234567890',
  category: 'Corporate',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Patent({ patent }) {
  return (
    <li
      key={patent.email}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className=" truncate text-sm font-medium text-gray-900">
              {patent.organization}
            </h3>{' '}
            <div className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              CL# {patent.classNo}
            </div>
            <img
              className="h-10 w-10 flex-shrink-0 rounded-lg  bg-gray-300"
              src={`https://ui-avatars.com/api/?background=4f46e5&color=fff&name=${patent.title}`}
              alt=""
            />{' '}
          </div>

          <p className="mt-1 truncate text-sm text-gray-500">{patent.title}</p>
          <p className="mt-1 truncate text-sm text-gray-500">{patent.date}</p>
          <p className="mt-1 truncate text-sm text-gray-500">
            Design No. {patent.designNo}
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`mailto:${patent.email}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">View Patent</span>
            </a>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function PatentDirectory() {
  return (
    <>
      <Head>
        <title>Patent - DEPTO</title>
      </Head>
      <BasicLayout title="Patent Directory">
        <div className="-mt-2 mb-3">
          <div className="relative flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Quick Search"
              id="search"
              className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Patent patent={patent} />
          <Patent patent={patent} />
          <Patent patent={patent} />
          <Patent patent={patent} />
          <Patent patent={patent} />
        </ul>
      </BasicLayout>
    </>
  )
}

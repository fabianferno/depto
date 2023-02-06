import { HuddleIframe } from '@huddle01/huddle01-iframe'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function Huddle({
  meetCode,
  height = '600',
  width = '100%',
  title = 'Call for a DAO wide Huddle 📞',
}) {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/${meetCode}`,
    height: height,
    width: width,
    noBorder: true, // false by default
  }

  return (
    <Fragment>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-md border border-gray-300 bg-indigo-500 px-4 py-2 text-sm font-medium text-gray-100 shadow-sm hover:bg-indigo-600"
      >
        {title}
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
                  <HuddleIframe config={iframeConfig} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  )
}

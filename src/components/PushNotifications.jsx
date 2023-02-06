import * as PushAPI from '@pushprotocol/restapi'
import { useEffect, useState } from 'react'
import { BellIcon } from '@heroicons/react/20/solid'
import { Image } from 'next/image'

import logoPush from '@/images/push.jpeg'

export function PushProtocol() {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    ;(async () => {
      const notifications = await PushAPI.user.getFeeds({
        user: 'eip155:5:0xdA9502932Ff895b0107Fc7944B77E48EBe32c808', // user address in CAIP
        env: 'staging',
      })

      console.log(notifications)
      setNotification(notifications[notifications.length - 1].message)
    })()
  }, [])

  return (
    <div className="rounded-md bg-pink-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <BellIcon className="h-5 w-5 text-pink-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-pink-700">
            {notification ? JSON.stringify(notification) : 'Loading...'}
          </p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a
              href="#"
              className="whitespace-nowrap font-medium text-pink-700 hover:text-pink-600"
            >
              Details
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

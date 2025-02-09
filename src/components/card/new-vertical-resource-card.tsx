import * as React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
  CardAuthor,
  CardFooter,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from '../markdown'
import {track} from 'utils/analytics'
import {get, isEmpty} from 'lodash'
import {CardResource} from 'types'
import {Textfit} from 'react-textfit'
import analytics from 'utils/analytics'
import Heading from './heading'
import CheckIcon from 'components/icons/check'

const VerticalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
  small?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  completedCoursesIds?: string[]
}> = ({
  children,
  resource,
  location,
  className = 'rounded-md aspect-w-3 aspect-h-4 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50',
  describe = false,
  small = false,
  as,
  completedCoursesIds,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const {externalId} = resource
  const isCourseCompleted =
    !isEmpty(completedCoursesIds) &&
    externalId &&
    completedCoursesIds?.some((courseId: string) => courseId === externalId)

  return (
    <ResourceLink
      path={(resource.path || resource.url) as string}
      location={location as string}
      target={resource.url ? '_blank' : undefined}
      resource_type={resource.name}
      instructor={resource?.instructor?.name}
      tag={resource.tag?.name}
    >
      <Card {...props} resource={resource} className={className}>
        {resource.background && (
          <Image
            src={resource.background}
            layout="fill"
            objectFit="cover"
            alt=""
            aria-hidden="true"
          />
        )}
        <CardContent className="grid grid-rows-6 xl:p-5 p-2 pt-5">
          <CardHeader className={`row-span-3 relative `}>
            <PreviewImage
              small={small}
              image={resource.image}
              title={resource.title}
            />
          </CardHeader>
          <CardMeta
            className={`row-span-3 text-center flex flex-col items-center justify-center `}
          >
            {resource.name && (
              <div className="flex items-center mb-1">
                {isCourseCompleted && (
                  <span title="Course completed" className=" text-green-500">
                    <CheckIcon />
                  </span>
                )}
                <p
                  aria-hidden
                  className="uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60"
                >
                  {resource.name}
                </p>
              </div>
            )}
            <Textfit
              mode="multi"
              className={`lg:h-[70px] h-[45px] font-medium text-center leading-tight flex items-center justify-center w-full`}
              max={22}
            >
              <Heading as={as}>{resource.title}</Heading>
            </Textfit>
            {describe && (
              <CardBody className="prose dark:prose-dark max-w-none pb-4 text-center opacity-80 dark:prose-a:text-blue-300 prose-a:text-blue-500 leading-tight">
                <Markdown>{resource.description}</Markdown>
              </CardBody>
            )}
            <CardFooter>
              <CardAuthor />
            </CardFooter>
          </CardMeta>
        </CardContent>
        {children}
      </Card>
    </ResourceLink>
  )
}

export const ResourceLink: React.FC<{
  path: string
  resource_type: string
  location: string
  tag?: any
  className?: string
  instructor?: string
  linkType?: string
  target?: '_blank' | '_self'
}> = ({
  children,
  path,
  tag,
  resource_type,
  instructor,
  location,
  className,
  linkType = 'text',
  target,
  ...props
}) => (
  <Link href={path}>
    <a
      onClick={() => {
        analytics.events.activityInternalLinkClick(
          resource_type,
          location,
          tag,
          path,
          instructor,
        )
      }}
      target={target || '_self'}
      {...props}
    >
      {children}
    </a>
  </Link>
)

const PreviewImage: React.FC<{title: string; image: any; small?: boolean}> = ({
  title,
  image,
  small,
}) => {
  if (!image) return null

  return (
    <Image
      aria-hidden
      src={get(image, 'src', image)}
      objectFit="contain"
      layout="fill"
      quality={100}
      alt=""
    />
  )
}
export {VerticalResourceCard}

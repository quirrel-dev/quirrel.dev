import { Link } from "blitz"

interface CardItem {
  title: string
  href: string
}

interface CardListProps {
  emptyText: string
  items: CardItem[]
}

export function CardList(props: CardListProps) {
  return (
    <ul>
      {props.items.length === 0 && (
        <li className="max-w rounded shadow-sm border py-2 px-4 text-center">{props.emptyText}</li>
      )}
      {props.items.map((item, index, arr) => (
        <Link key={item.href} href={item.href}>
          <li
            className={`max-w shadow-sm border py-2 px-4 flex justify-between items-center hover:bg-gray-200 transition duration-100 text-gray-600 hover:text-gray-800 ${
              index === 0 ? "rounded-t" : ""
            } ${index === arr.length - 1 ? "rounded-b" : ""}`}
          >
            <span className="text-xl">{item.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="inline w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
        </Link>
      ))}
    </ul>
  )
}

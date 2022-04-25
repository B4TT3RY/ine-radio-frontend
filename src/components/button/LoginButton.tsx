import Link from "next/link";
import { classNames } from "../../utils";

export default function LoginButton() {
  return (
    <Link href='/auth/login'>
      <a
        className={classNames(
          'text-xl text-white cursor-pointer transition-all shadow-lg rounded-2xl b-0 p-3',
          'bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50'
        )}
      >
        트위치로 로그인
      </a>
    </Link>
  )
}

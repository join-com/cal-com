import classNames from "classnames";

import { HeadSeo } from "@calcom/ui";

import Loader from "@components/Loader";

interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f3f4f6] py-12 sm:px-6 lg:px-8">
      <HeadSeo title={props.title} description={props.description} />
      {props.showLogo && (
        <svg
          viewBox="0 0 550 300"
          aria-labelledby="JOIN_LOGO"
          className="h-25px ml-1 mb-auto h-5 fill-neutral-900">
          <title id="JOIN_LOGO">Join</title>
          <path d="M526.275 75H494.667V162.717L434.833 80.325C432.525 77.325 428.858 74.95 424.725 74.95L380.608 74.9917V250.358H431.292V162.858L491.017 245.167C493.325 248.233 497.1 250.183 501.283 250.183H526.275C536.8 250.183 545.333 241.808 545.333 231.45V93.725C545.333 83.375 536.8 75 526.275 75ZM241.133 162.85C241.133 142.158 224 125.325 202.933 125.325C181.883 125.325 164.767 142.158 164.767 162.85C164.767 183.55 181.883 200.375 202.95 200.375C224 200.375 241.133 183.55 241.133 162.85ZM291.933 162.783C291.933 211.067 252.108 250.192 202.983 250.192C153.858 250.192 114.042 211.067 114.042 162.792C114.042 114.517 153.858 75.375 202.983 75.375C252.108 75.375 291.933 114.5 291.933 162.792V162.783ZM304.583 18.75V49.8167H355.267V0H323.583C313.058 0 304.583 8.38333 304.583 18.75V18.7333V18.75ZM304.583 250.2H355.267V75.1667H304.583V250.183V250.2ZM69.75 75.1667H101.358V200.367C101.375 255.4 56 300 0 300V250.192C27.95 250.192 50.6917 227.85 50.6917 200.375V93.9583C50.6917 83.6083 59.2167 75.175 69.7583 75.175L69.75 75.1667Z" />
        </svg>
      )}

      <div className={classNames(props.showLogo ? "text-center" : "", "sm:mx-auto sm:w-full sm:max-w-md")}>
        {props.heading && <h2 className="font-cal text-center text-3xl text-gray-900">{props.heading}</h2>}
      </div>
      {props.loading && (
        <div className="absolute z-50 flex h-screen w-full items-center bg-gray-50">
          <Loader />
        </div>
      )}
      <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-2 rounded-md border border-gray-200 bg-white px-4 py-10 sm:px-10">
          {props.children}
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">{props.footerText}</div>
      </div>
    </div>
  );
}

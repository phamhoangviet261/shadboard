"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ModelLoadingOverlay from "@/components/model-loading"

const technologies = [
  {
    name: "HTML 5",
    icon: "html",
  },
  {
    name: "CSS 3",
    icon: "css",
  },
  {
    name: "JavaScript",
    icon: "javascript",
  },
  {
    name: "TypeScript",
    icon: "typescript",
  },
  {
    name: "React JS",
    icon: "reactjs",
  },
  {
    name: "Redux Toolkit",
    icon: "redux",
  },
  {
    name: "Tailwind CSS",
    icon: "tailwind",
  },
  {
    name: "Node JS",
    icon: "nodejs",
  },
  {
    name: "MongoDB",
    icon: "mongodb",
  },
  {
    name: "Three JS",
    icon: "threejs",
  },
  {
    name: "git",
    icon: "git",
  },
  {
    name: "figma",
    icon: "figma",
  },
  {
    name: "docker",
    icon: "docker",
  },
]

const experiences = [
  {
    title: "Software Developer",
    company_name: "VNG - Vietnam",
    icon: "reactjs",
    iconBg: "#383E56",
    date: "March 2021 - September 2021",
    points: [
      `Utilized NextJS to maintain and enhance new features on the
main career page of the company's website.`,
      `
Maximize the speed and scalability of the website through
optimization.`,
      `
Implement features for internal company use.`,
    ],
  },
  {
    title: "Software Developer",
    company_name: "mogul.SG - Singapore",
    icon: "reactjs",
    iconBg: "#E6DEDD",
    date: "September 2021 - now",
    points: [
      `Spearheaded the development of a cutting-edge website
      leveraging the power of NextJS, delivering a seamless user
      experience.`,
      `
      Orchestrated the design and implementation of a high-traffic
      website tailored to accommodate a large online user base,
      culminating in a remarkable 300% surge in sales.`,
      `
      Executed a smooth transition by migrating the website
      infrastructure from ReactJS to NextJS, enhancing performance
      and scalability for future growth.`,
      `
      Provide solutions to enhance website speed and streamline
      workflow.`,
    ],
  },
]

const projects = [
  {
    name: "MOGUL",
    description:
      "MOGUL.sg is a cutting-edge Real Estate platform harnessing geospatial technology to digitally enable home buyers, home renters, property sellers and Property agents in Singapore to search and sell in a SMART and hassle-free manner.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nextjs",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: "mogul",
    source_code_link: "https://github.com/",
    url: "https://www.mogul.sg/",
  },
  {
    name: "Datasuite",
    description:
      "The Mogul DataSuite is a one-stop search solution powered by Hyperlocal Intelligence. It is designed to make your property search experience not only easier, but faster. Using keyword stacking, our DataSuite then aggregates info, utilising cutting edge tech like Geospatial Analysis to provide you with the best search results.",
    tags: [
      {
        name: "vuejs",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: "datasuite",
    source_code_link: "https://github.com/",
    url: "https://www.mogul.sg/datasuite",
  },
  {
    name: "VNG Job site",
    description: `The page at VNG Career - Tìm kiếm việc làm is VNG Corporation's official job search platform. It allows users to explore a wide range of job opportunities across different departments, including technology, operations, marketing, and more. The platform provides detailed job listings with descriptions, requirements, and the application process for roles within VNG, one of Vietnam's leading technology companies. Applicants can filter jobs by category, location, or keywords, making it easier to find suitable positions. It also features career development insights and company culture highlights.`,
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: "vng",
    source_code_link: "https://github.com/",
    url: "https://career.vng.com.vn/vi/tim-kiem-viec-lam",
  },
]

export default function MePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <ModelLoadingOverlay
          loading={isLoading}
          modelSrc="/models/chibi_battle_bat_xayah.glb"
        />
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* IMPLEMENT HERE */}
    </div>
  )
}

export interface Technology {
  name: string
  icon?: string
}

export interface Experience {
  title: string
  company_name: string
  icon?: string
  iconBg?: string
  date?: string
  points?: string[]
}

export interface ProjectTag {
  name: string
  color?: string
}

export interface Project {
  name: string
  description?: string
  tags?: ProjectTag[]
  image?: string
  source_code_link?: string
  url?: string
}

export const technologies: Technology[] = [
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

export const experiences: Experience[] = [
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

export type TagName =
  | "react"
  | "nextjs"
  | "tailwind"
  | "typescript"
  | "node"
  | "postgresql"
  | "aws"
  | "docker"
  | "git"
  | "figma"
  | "vuejs"
  | "restapi"
  | "scss"
  | "supabase"
  | "css"

const tagColors: Record<TagName, string> = {
  react: "text-cyan-400",
  nextjs: "text-neutral-900",
  tailwind: "text-sky-400",
  typescript: "text-blue-500",
  node: "text-green-600",
  postgresql: "text-indigo-500",
  aws: "text-orange-400",
  docker: "text-blue-400",
  git: "text-red-500",
  figma: "text-pink-500",

  vuejs: "text-emerald-500",
  restapi: "text-rose-400",
  scss: "text-pink-400",
  supabase: "text-green-400",
  css: "text-blue-600",
}

const withColors = (tags: TagName[]) =>
  tags.map((tag) => ({
    name: tag,
    color: tagColors[tag],
  }))

export const projects: Project[] = [
  {
    name: "MOGUL",
    description:
      "MOGUL.sg is a cutting-edge Real Estate platform harnessing geospatial technology to digitally enable home buyers, home renters, property sellers and Property agents in Singapore to search and sell in a SMART and hassle-free manner.",
    tags: withColors([
      "react",
      "nextjs",
      "tailwind",
      "typescript",
      "node",
      "postgresql",
      "aws",
      "docker",
      "git",
      "figma",
    ]),
    image: "mogul",
    url: "https://www.mogul.sg/",
  },
  {
    name: "Datasuite",
    description:
      "The Mogul DataSuite is a one-stop search solution powered by Hyperlocal Intelligence. It is designed to make your property search experience not only easier, but faster.",
    tags: withColors(["vuejs", "restapi", "scss", "supabase", "git", "figma"]),
    image: "datasuite",
    url: "https://www.mogul.sg/datasuite",
  },
  {
    name: "VNG Job site",
    description:
      "Official job search platform of VNG Corporation, allowing users to explore job opportunities across multiple departments with filtering and detailed job listings.",
    tags: withColors(["nextjs", "typescript", "css", "git", "figma"]),
    image: "vng",
    url: "https://career.vng.com.vn/vi/tim-kiem-viec-lam",
  },
]

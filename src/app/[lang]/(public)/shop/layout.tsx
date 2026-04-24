import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { StorefrontHeader } from "@/components/lensora/storefront-header"

export default async function ShopLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  return (
    <div className="min-h-screen flex flex-col">
      <StorefrontHeader lang={params.lang} />
      <main className="flex-1">{props.children}</main>
      <footer className="border-t border-border py-10 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Lensora. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Premium eyewear, thoughtfully crafted.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

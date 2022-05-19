import { lazy } from "react"

export const Admin = lazy(
  () => import(/* webpackChunkName: "admin" */ "./admin")
)
export const Create = lazy(
  () => import(/* webpackChunkName: "create" */ "./create")
)
export const Participate = lazy(
  () => import(/* webpackChunkName: "participate" */ "./participate")
)
export const Results = lazy(
  () => import(/* webpackChunkName: "results" */ "./results")
)

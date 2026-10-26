// Central explicit re-export of external hook library so app code never
// imports usehooks-ts directly. Swap the library here only.
// Add exports here when adopting a new hook from the package.
export {
  useDebounceValue,
  useEventListener,
  useInterval,
  useMediaQuery,
  useOnClickOutside,
} from "usehooks-ts";

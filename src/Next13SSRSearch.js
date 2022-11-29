// we actually need a third search component that does full NEXT SSR
// best way is to make a server component that renders a results table on the 
// server but then has client components for the filter and pagination bars
// unlike Next13HTTPSearch this component can use next/router and get Next13
// route-rendering optimizations. For style points make the column headers fully
// functional with client components, too.

export default () => 'SSR Search Component'
type WrapperType = {
  className ?: string,
  children ?: React.ReactNode 
}
const Wrapper = (props : WrapperType) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${props?.className ?? ''}`}>
      {props.children}
    </div>
  )
}

export default Wrapper
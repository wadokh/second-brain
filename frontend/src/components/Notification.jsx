const Notification = ({ message, className }) => {
  if (message !== null) {
    return (
      <div className={className}>
        {message}
      </div>
    )
  }
}

export default Notification
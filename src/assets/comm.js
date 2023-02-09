const webSocketUrl = () => {
  let domain = document.domain;
  let isSsl = document.location.href.search('https') === -1
  if (isSsl) {
    return "ws://" + domain + ":6303"
  }
  return "wss://" + domain + '/wss';
}

export {
  webSocketUrl
}

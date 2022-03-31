export function unitToKorean(unit: string): string {
  switch (unit) {
    case 'minutes':
      return '분'
    case 'hours':
      return '시간'
    case 'days':
      return '일'
    case 'months':
      return '개월'
    case 'years':
      return '년'
    default:
      return ''
  }
}

export function getMaxTimeWithUnit(unit: string): number | undefined {
  switch (unit) {
    case 'minutes':
      return 59
    case 'hours':
      return 23
    case 'days':
      return 29
    case 'months':
      return 11
    case 'years':
      return undefined
    default:
      return undefined
  }
}

export function getErrorMessage(code: string, message?: string): [string, string] {
  let title = ''
  let subTitle = ''

  switch (code) {
    case 'DATABASE_ERROR':
      title = '데이터베이스 오류가 발생했어요.'
      subTitle = '나중에 다시 시도해 주세요.'
      break
    case 'UNAUTHORIZED':
      title = '로그인이 필요해요.'
      subTitle = '로그인 후 다시 시도해 주세요.'
      break
    case 'PARSE_ERROR':
      title = '값을 파싱하는 도중 문제가 생겼어요.'
      subTitle = '관리자에게 문의해 주세요.'
      break
    case 'INTERNAL_SERVER_ERROR':
      title = '서버에서 오류가 발생했어요.'
      subTitle = '잠시 후에 다시 시도해 주세요.'
      break
    case 'ALREADY_SUBMITTED':
      title = '이미 사연을 보냈어요.'
      subTitle = message ?? ''
      break
    case 'STORY_NOT_FOUND':
      title = '사연을 찾을 수 없어요.'
      subTitle = '이미 마감된 사연은 아닌지 확인해 주세요.'
      break
    case 'VERIFICATION_FAILURE':
      title = '사연을 검증하는 도중 문제가 발생했어요.'
      subTitle = message ?? ''
      break
    case 'USER_NOT_FOUND':
      title = '사용자를 찾을 수 없어요.'
      subTitle = '로그인을 다시 해보거나 관리자에게 문의해 주세요.'
      break
    case 'STREAMER_NOT_FOUND':
      title = '스트리머를 찾을 수 없어요.'
      subTitle = '관리자에게 문의해 주세요.'
      break
    case 'REQUEST_ERROR':
      title = '요청을 보내는 도중 문제가 발생했어요.'
      subTitle = '나중에 다시 시도해 주세요.'
      break
    case 'REFRESH_TOKEN_ERROR':
      title = '트위치 토큰 갱신 도중 문제가 발생했어요.'
      subTitle = '나중에 다시 시도해 보거나 관리자에게 문의해 주세요.'
    default:
      title = '알 수 없는 오류가 발생했어요.'
      subTitle = '관리자에게 문의해 주세요.'
      break
  }

  return [title, subTitle]
}

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

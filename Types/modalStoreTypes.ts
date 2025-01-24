interface Link {
  url: string
  title: textLocales[]
  button: {
    isBtn: boolean
    style: {
      color: string
      backgroundColor: string
      [key: string]: any
    }
  }
}
export interface textLocales{
  text: string,
  language: {
    name: string,
    _id: string
  }
}

interface Content {
  link: Link
  textLocales: textLocales[],
  inputText: {
    textLocales: textLocales[],
    color: string
    urlTitleColor: string
  }
  fontSize: number
  positions: {
    justifyContent: string
    alignItems: string
  }
}

interface Dimensions {
  width: number
  height: number
}

interface Name {
  [key: string]: string
}

export interface ModalData {
  _id: string
  active: boolean
  schedule: number
  backgroundImageUrl: string
  autoCloseAfter: number
  showNTimesForPremium: number
  showNTimesForFree: number
  content: Content
  createdAt: string
  dimensions: Dimensions
  name: Name
  pages: string[]
  targetedAt: string
  updatedAt: string
  startDate: Date;
  endDate: Date;
}

export interface ModalState {
  modals: ModalData[]
  setModals: (modals: ModalData[]) => void
  currentModal: ModalData | null
  openModal: (modalId: string) => void
  closeModal: () => void
}

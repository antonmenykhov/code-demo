<template>
  <Modal
    :title="title"
    :open="opened"
    @ok="() => handleOk()"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="1600px"
    wrap-class-name="full-modal"
    :ok-button-props="{ disabled: isInValidForm }"
    :closable="false"
  >
    <Row style="height: 100%" class="card-main-container" :class="{ isMobile }">
      <Col span="14">
        <Form ref="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <FormItem label="Наименование документа" :validate-status="fieldStatuses.name">
            <Input
              :disabled="editableDocumentItem.isRegistered"
              v-model:value="editableDocumentItem.name"
            />
          </FormItem>
          <FormItem
            label="Регистрационный №, дата"
            v-if="isInitier"
            :validate-status="fieldStatuses.regnumber"
          >
            <div class="row">
              <Input :disabled="!isInitier" v-model:value="editableDocumentItem.regnumber" />
              <DatePicker
                disabled
                v-model:value="editableDocumentItem.created"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DDTHH:mm:ssZ[Z]"
              />
            </div>
          </FormItem>
          <FormItem label="Содержание" v-if="!editableDocumentItem.isIncoming">
            <WysiwygEditor
              v-if="opened"
              :key="editableDocumentItem.id"
              :disabled="
                ((editableDocumentItem.isStamped || false) && !isInitier) ||
                editableDocumentItem.isExternalRegistered ||
                (editableDocumentItem.emailers?.length ? true : false)
              "
              v-model:value="editableDocumentItem.content"
            />
          </FormItem>
          <ContractorGroup
            :disabled="
              editableDocumentItem.isRegistered ||
              ((editableDocumentItem.isStamped || false) && !isInitier)
            "
            :label-contractor="editableDocumentItem.isIncoming ? 'От кого' : 'Кому'"
            label-director="Директор контрагента"
            :field-statuses="fieldStatuses"
            :show-director-select="!editableDocumentItem.isIncoming"
            v-model:contractor="editableDocumentItem.contractor"
            v-model:contractor-director="editableDocumentItem.contractorDirector"
            v-model:contractor-director-id="editableDocumentItem.contractorDirectorId"
            v-model:contractor-id="editableDocumentItem.contractorId"
          />

          <div class="additional-contractors" v-if="!editableDocumentItem.isIncoming">
            <ContractorGroup
              v-for="(contractor, index) in editableDocumentItem.additionalContractors"
              :key="contractor.id"
              :disabled="
                editableDocumentItem.isRegistered ||
                ((editableDocumentItem.isStamped || false) && !isInitier)
              "
              :label-contractor="`Доп. контрагент ${index + 1}`"
              :label-director="`Директор доп. контрагента ${index + 1}`"
              :field-statuses="fieldStatuses"
              show-director-select
              v-model:contractor="contractor.contractor"
              v-model:contractor-director="contractor.contractorDirector"
              v-model:contractor-director-id="contractor.contractorDirectorId"
              v-model:contractor-id="contractor.contractorId"
            />
            <FormItem
              v-show="
                !editableDocumentItem.isRegistered &&
                !((editableDocumentItem.isStamped || false) && !isInitier)
              "
              label="Дополнительные контрагенты"
            >
              <div class="row">
                <Button @click="addAdditionalContractor">Добавить</Button>
                <Button danger @click="deleteAdditionalContractor">Удалить</Button>
              </div>
            </FormItem>
          </div>

          <FormItem
            :label="!editableDocumentItem.isIncoming ? 'От кого' : 'Кому'"
            :validate-status="fieldStatuses.companyId"
          >
            <Select
              :disabled="
                editableDocumentItem.isRegistered ||
                ((editableDocumentItem.isStamped || false) && !isInitier)
              "
              v-model:value="editableDocumentItem.companyId"
              :options="companiesHandbook"
              show-search
              optionFilterProp="label"
            />
          </FormItem>
          <FormItem v-if="!editableDocumentItem.isIncoming" label="Дополнительные подписанты">
            <Select
              :disabled="
                editableDocumentItem.isRegistered ||
                ((editableDocumentItem.isStamped || false) && !isInitier)
              "
              :value="additionalSignersIds"
              :options="additionalSignersHandbook"
              show-search
              mode="tags"
              optionFilterProp="label"
              @change="changeAdditionalSigners"
            />
          </FormItem>
          <FormItem v-if="!editableDocumentItem.isIncoming" label="Исполнитель">
            <div class="row">
              <Select
                :disabled="editableDocumentItem.isRegistered || !isInitier"
                :value="editableDocumentItem.workerId || ''"
                :options="usersHandbook"
                show-search
                optionFilterProp="label"
                @update:value="(newVal) => (editableDocumentItem.workerId = `${newVal}`)"
              />
              <div class="row select-checkbox">
                <Switch
                  v-model:checked="editableDocumentItem.withWorkerMark"
                  :disabled="editableDocumentItem.isRegistered"
                />
                <div>Отображать</div>
              </div>
              <div class="row select-checkbox">
                <Switch
                  v-model:checked="editableDocumentItem.companyEmailToWorkerMark"
                  :disabled="editableDocumentItem.isRegistered"
                />
                <div>Email компании</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="№, дата контрагента" v-if="!editableDocumentItem.isIncoming">
            <div class="row">
              <Input
                v-model:value="editableDocumentItem.externalRegnumber"
                :disabled="!editableDocumentItem.isRegistered"
              />
              <DatePicker
                v-model:value="editableDocumentItem.externalCreated"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DDTHH:mm:ssZ[Z]"
                :disabled="!editableDocumentItem.isRegistered"
              />
            </div>
          </FormItem>
          <FormItem label="Почтовый чек" v-if="!editableDocumentItem.isIncoming">
            <div class="row">
              <Input
                :value="editableDocumentItem.reciept?.fileName || 'Файл не загружен'"
                readonly
              />
              <Button
                :disabled="!editableDocumentItem.isRegistered"
                @click="() => (recieptUploaderVisible = true)"
                >Загрузить</Button
              >
            </div>
          </FormItem>

          <FormItem label="Регистрация/отправка">
            <div class="row">
              <Button
                v-if="isInitier"
                :disabled="
                  editableDocumentItem.attachmentId === null ||
                  editableDocumentItem.id === 0 ||
                  isInValidForm ||
                  loadingInCard
                "
                @click="() => registerDocumentHandler()"
              >
                Регистрация компанией
              </Button>
              <Button
                v-if="!editableDocumentItem.isIncoming"
                :disabled="!editableDocumentItem.isRegistered || loadingInCard"
                @click="addExternalRegNumberHandler"
              >
                Регистрация контрагентом
              </Button>
              <Button
                v-if="!editableDocumentItem.isIncoming"
                :disabled="!editableDocumentItem.isRegistered || loadingInCard"
                @click="() => (createEmailModalVisible = true)"
              >
                Отправить email
              </Button>
            </div>
          </FormItem>
        </Form>
      </Col>
      <Col span="10" style="padding-left: 10px" v-if="opened">
        <Tabs v-model:active-key="tabSelected">
          <TabPane :key="1" tab="Просмотр" v-if="editableDocumentItem.attachment">
            <PdfViewer
              v-if="tabSelected === 1"
              :key="pdfKey"
              height="100%"
              :source="`${base_url}/attachment/${editableDocumentItem.attachment.id}`"
              :file-name="editableDocumentItem.name"
              @print-without-sign="printWithoutSign"
          /></TabPane>
          <TabPane :key="2" tab="Загрузить" v-if="!editableDocumentItem.isRegistered">
            <UploadZone
              @uploading-start="deleteAttachmentHandler"
              @uploaded="setUploadedAttachment"
            />
          </TabPane>
          <TabPane
            :disabled="editableDocumentItem.isRegistered"
            :key="3"
            :tab="`Приложения (${editableDocumentItem.additionalAttachments.length})`"
            v-if="!editableDocumentItem.isIncoming"
          >
            <UploadZone
              class="additional-attachment-upload"
              @uploaded="setUploadedAdditionalAttachment"
            />
            <h4>Список приложений</h4>
            <Empty v-if="editableDocumentItem.additionalAttachments.length === 0" />
            <div
              class="attachment-row"
              v-for="(attachment, index) in editableDocumentItem.additionalAttachments"
              :key="attachment.id"
            >
              <div class="name">{{ index + 1 }}. {{ attachment.fileName }}</div>
              <div class="attachment-row">
                <Button type="text" @click="downloadAttachment(attachment)"> Скачать </Button>
                <Button
                  type="text"
                  danger
                  @click="
                    () => {
                      editableDocumentItem.additionalAttachments.splice(index, 1)
                    }
                  "
                >
                  Удалить
                </Button>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    <Modal title="Загрузка почтового чека" v-model:open="recieptUploaderVisible">
      <UploadZone @uploaded="setReciept" />
    </Modal>
    <CreateEmailModal
      :document="editableDocumentItem"
      v-model:opened="createEmailModalVisible"
      @update:opened="
        () => {
          updateDocument(editableDocumentItem), pdfKey++
        }
      "
    />
    <div class="loading-wrapper" :class="{ visible: loadingInCard }">
      <Spin size="large" tip="Выполняется обработка" />
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import type { DocumentItem } from '@/interfaces/document-item.interface'
import {
  Modal,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  TabPane,
  Tabs,
  message,
  Switch,
  Empty,
  Spin
} from 'ant-design-vue'
import { computed, ref } from 'vue'
import PdfViewer from './PdfViewer.vue'
import useCardPreview from '@/composables/useCardPreview.composable'
import WysiwygEditor from './WysiwygEditor.vue'
import useDocumentWork from '@/composables/useDocumentWork.composable'
import UploadZone from './UploadZone.vue'
import type { Attachment } from '@/interfaces/attachment.interface'
import { storeToRefs } from 'pinia'
import { useHandbookStore } from '@/stores/handbookStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { base_url } from '@/config/urls'
import { useModeStore } from '@/stores/modeStore'
import useDelegationWork from '@/composables/useDelegationWork.composable'
import ContractorGroup from './document-card/ContractorGroup.vue'
import useHttp from '@/composables/useHttp.composable'
import type { SelectValue } from 'ant-design-vue/es/select'
import CreateEmailModal from './CreateEmailModal.vue'
import { useDebounceFn } from '@vueuse/core'

const { isMobile } = storeToRefs(useModeStore())
const { isInitier, myId } = storeToRefs(useUserInfoStore())
const { companies, users } = storeToRefs(useHandbookStore())
const opened = ref(false)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'documentSaved'): void
  (e: 'registered', documentItem: DocumentItem): void
}>()
async function handleOk(showMessage = true) {
  const isNeeedCreateDelegation =
    !editableDocumentItem.value.parentId &&
    editableDocumentItem.value.id === 0 &&
    !editableDocumentItem.value.isIncoming
  await updateDocument(await saveDocument(editableDocumentItem.value))
  if (isNeeedCreateDelegation) createNeedAproovingDelegation()
  emit('documentSaved')
  if (showMessage) message.success('Документ сохранен')
}

const { saveDelegationHandler, createManagerDelegation } = useDelegationWork()

async function createNeedAproovingDelegation() {
  await saveDelegationHandler({
    ...createManagerDelegation({ document: editableDocumentItem.value }),
    description: 'Нужно утвердить',
    isNeedAprooving: true,
    toId: myId.value,
    fromId: createManagerDelegation({ document: editableDocumentItem.value }).toId,
    isReaded: true
  })
}

const {
  getNewDocumentMock,
  saveDocument,
  getOneDocument,
  registerDocument,
  toggleDocumentCompleted,
  addExternalRegNumber
} = useDocumentWork()

function closeHandler(e: boolean) {
  if (loadingInCard.value) return
  emit('close')
  opened.value = e
}

const companiesHandbook = computed(() =>
  companies.value.map((company) => ({ label: company.name, value: company.id }))
)

const additionalSigners = computed(
  () =>
    companies.value.find((company) => company.id === editableDocumentItem.value.companyId)
      ?.additionalSigners || []
)

const additionalSignersHandbook = computed(() =>
  additionalSigners.value.map((signer) => ({ label: signer.name, value: signer.id }))
)

const additionalSignersIds = computed(() =>
  editableDocumentItem.value.additionalSigners.map((signer) => signer.id)
)

function changeAdditionalSigners(newValue: SelectValue) {
  if (Array.isArray(newValue)) {
    editableDocumentItem.value.additionalSigners = additionalSigners.value.filter((signer) =>
      (newValue as number[]).includes(signer.id)
    )
  }
  // const existIndex = editableDocumentItem.value.additionalSigners.findIndex(
  //   (signer) => signer.id === newValue
  // )
  // console.log(newValue)
  // if (existIndex !== -1) {
  //   editableDocumentItem.value.additionalSigners.splice(existIndex, 1)
  // } else {
  //   const signer = additionalSigners.value.find((signer) => signer.id === newValue)
  //   if (signer) editableDocumentItem.value.additionalSigners.push(signer)
  // }
}

const usersHandbook = computed(() =>
  users.value.map((company) => ({ label: company.lastName, value: company.id }))
)

function setUploadedAttachment(attachment: Attachment) {
  editableDocumentItem.value.attachment = attachment
  editableDocumentItem.value.attachmentId = attachment.id
  tabSelected.value = 1
}
function setUploadedAdditionalAttachment(attachment: Attachment) {
  editableDocumentItem.value.additionalAttachments.push(attachment)
}
function deleteAttachmentHandler() {
  editableDocumentItem.value.attachmentId = null
}

const tabSelected = ref(1)
async function uploadPreviewHandler() {
  if (!editableDocumentItem.value.isIncoming) {
    await getContent(editableDocumentItem.value, editableDocumentItem.value.isStamped, true)
  }
  tabSelected.value = 1
}

async function registerDocumentHandler(isFromDelegation: boolean = false) {
  if (loadingInCard.value) return
  loadingInCard.value = true
  await handleOk(false)
  const regResult = (await registerDocument({ document: editableDocumentItem.value })).data
  editableDocumentItem.value.regnumber = regResult.regnumber
  editableDocumentItem.value.isRegistered = regResult.isRegistered
  if (
    editableDocumentItem.value.isIncoming === false &&
    !editableDocumentItem.value.isCompleted &&
    editableDocumentItem.value.isStamped
  )
    toggleDocumentCompleted(editableDocumentItem.value.id)
  await uploadPreviewHandler()
  await handleOk()
  loadingInCard.value = false
  if (!isFromDelegation) {
    emit('registered', editableDocumentItem.value)
    closeHandler(false)
  }
}

const title = computed(() =>
  editableDocumentItem.value.id === 0 ? 'Создание документа' : 'Редактирование документа'
)

async function createDocument(
  direction: 'in' | 'out',
  parentId?: number | undefined,
  contractorId?: number | '',
  companyId?: number | '',
  attachments?: Attachment[]
) {
  opened.value = true
  editableDocumentItem.value = getNewDocumentMock(
    direction === 'in',
    parentId,
    contractorId,
    companyId,
    attachments
  )
  chooseTab()
}
async function updateDocument(document: DocumentItem) {
  loadingInCard.value = true
  opened.value = true
  editableDocumentItem.value = await getOneDocument(document.id)
  chooseTab()
  loadingInCard.value = false
}

function chooseTab() {
  if (editableDocumentItem.value.id === 0) return (tabSelected.value = 2)
  tabSelected.value = 1
}

const pdfKey = ref(0)

defineExpose({
  createDocument,
  updateDocument,
  registerDocumentHandler
})
const editableDocumentItem = ref<DocumentItem>(getNewDocumentMock(true))
const { getContent, printWithoutSign } = useCardPreview(editableDocumentItem, tabSelected)

const isNameValid = computed(
  () =>
    editableDocumentItem.value.name.length > 0 &&
    editableDocumentItem.value.name !== 'Необработанный документ'
)
function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}
const validFields = computed<{ [key in keyof Partial<DocumentItem>]: boolean }>(() => ({
  name: isNameValid.value,
  attachmentId: isNotNull(editableDocumentItem.value.attachmentId),
  companyId: isNotNull(editableDocumentItem.value.companyId),
  contractorId: isNotNull(editableDocumentItem.value.contractorId),
  created: isNotNull(editableDocumentItem.value.created)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<DocumentItem>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<DocumentItem>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<DocumentItem>)[]).some(
    (key) => validFields.value[key] === false
  )
)

const recieptUploaderVisible = ref(false)
function setReciept(attachment: Attachment) {
  editableDocumentItem.value.reciept = attachment
  editableDocumentItem.value.recieptId = attachment.id
  recieptUploaderVisible.value = false
}
async function addExternalRegNumberHandler() {
  loadingInCard.value = true
  await handleOk(false)
  await addExternalRegNumber({ document: editableDocumentItem.value })
  await updateDocument(editableDocumentItem.value)
  pdfKey.value++
  loadingInCard.value = false
}

function addAdditionalContractor() {
  editableDocumentItem.value.additionalContractors.push({
    contractorId: '',
    contractorDirectorId: '',
    documentId: editableDocumentItem.value.id,
    document: editableDocumentItem.value,
    contractor: null,
    contractorDirector: null,
    id: editableDocumentItem.value.additionalContractors.length
  })
}
function deleteAdditionalContractor() {
  editableDocumentItem.value.additionalContractors.splice(
    editableDocumentItem.value.additionalContractors.length - 1
  )
}
const { http } = useHttp()
async function downloadAttachment(attachment: Attachment) {
  const file = (await http.get(`${base_url}/attachment/${attachment.id}`, { responseType: 'blob' }))
    .data
  const link = document.createElement('a')
  link.href = URL.createObjectURL(file)
  link.download = attachment.fileName
  link.click()
}

const createEmailModalVisible = ref(false)
const loadingInCard = ref(false)
</script>
<style lang="scss">
.full-modal {
  .ant-modal {
    top: 2.5vh;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
  }
  .ant-modal-body {
    flex: 1;
  }
  .ant-tabs-tabpane.ant-tabs-tabpane-active {
    height: calc(95vh - 200px);
  }
  .preview {
    height: 90%;
    overflow: auto;
    border-radius: 5px;
    box-shadow: inset 0 0 2px #aeaeae;
    margin-bottom: 5px;
    padding: 1cm;
  }
  .ant-form-item {
    margin-bottom: 8px !important;
  }
}
.row {
  display: flex;
  gap: 5px;
  justify-content: space-between;

  & > * {
    flex: 1 1 150px;
    overflow: hidden;

    & > button {
      width: 100%;
    }
  }
  button span {
    text-overflow: ellipsis !important;
    width: 100%;
    overflow: hidden;
  }
}
.card-main-container.isMobile {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  & > * {
    flex: 1 1 300px;
    max-width: 100%;
  }
}
.additional-attachment-upload {
  display: block;
}
.attachment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
  &:last-child {
    border-bottom: none;
  }
}
.row.select-checkbox {
  align-items: center;
  justify-content: flex-start;
  & > *:first-child {
    max-width: 20px;
  }
}
.loading-wrapper {
  position: absolute;
  background: white;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -55555;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  &.visible {
    z-index: 99999;
    opacity: 1;
  }
}
</style>

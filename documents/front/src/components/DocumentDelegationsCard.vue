<template>
  <div class="document-delegation-card">
    <Modal
      title="Карточка документа"
      :open="opened"
      @update:open="closeHandler"
      width="1400px"
      :footer="null"
      wrap-class-name="delegation-card"
    >
      <Row
        style="height: 100%"
        :key="documentItem.id"
        class="card-main-container"
        :class="{ isMobile }"
      >
        <Col span="10">
          <h3>{{ reportName }}</h3>
          <Row justify="end" style="margin-top: 10px" class="row-end">
            <Select
              v-if="documentItem.group?.length && documentItem.group.length > 1"
              v-model:value="selectedDocumentId"
              :options="documentItem.group"
              :field-names="{ label: 'name', value: 'id', options: 'children' }"
              :dropdown-match-select-width="200"
              @select="chooseSelectedDocument"
            ></Select>
            <Button
              v-if="isInitier && documentItem.isIncoming && documentItem.child"
              @click="createDocumentCopyHandler"
            >
              Новая обработка
            </Button>
            <Dropdown
              placement="bottomRight"
              v-if="
                (isInitier || documentItem.delegations.length === 0) && !documentItem.isCompleted
              "
            >
              <template #overlay>
                <Menu>
                  <MenuItem v-if="isInitier" :key="0" @click="() => setToManager()">
                    Руководителю на рассмотрение
                  </MenuItem>
                  <MenuItem
                    v-if="isInitier && !documentItem.isIncoming"
                    :key="1"
                    @click="() => sendToManagerStamp()"
                  >
                    Руководителю на подпись
                  </MenuItem>
                  <MenuItem v-if="isManager || isInitier" :key="2" @click="() => setToWorker()">
                    На исполнение поручения
                  </MenuItem>
                </Menu>
              </template>
              <Button type="primary">Отправить</Button>
            </Dropdown>
            <Button v-if="isInitier" @click="toggleCompleted">
              {{ documentItem.isCompleted ? 'Открыть' : 'Завершить' }}
            </Button>

            <Button
              v-if="
                isInitier &&
                !documentItem.isRegistered &&
                documentItem.delegations.some(
                  (delegation) => delegation.description === 'На регистрацию'
                )
              "
              type="primary"
              @click="registerDocument"
            >
              Регистрация
            </Button>
          </Row>
          <h4>Поручения</h4>
          <div class="delegation-list">
            <DelegationCard
              v-for="delegation in documentItem.delegations.filter(
                (del) => del.parentId === null || del.parentId === undefined
              )"
              :key="delegation.id"
              :delegation="delegation"
              :delegations="documentItem.delegations"
              :isCompleted="documentItem.isCompleted"
              :canAddChild="canAddChild"
              :users="users"
              :canSetWithoutAnswer="canSetWithoutAnswer"
              @set-aprooving="setAprooving"
              @set-to-initier="setToInitier"
              @create-child-out-document="createChildOutDocument"
              @set-to-manager="setToManager"
              @set-comment-and-send-for-aprooving="setCommentAndSendForAprooving"
              @set-to-worker="setToWorker"
              @set-returning="setReturning"
              @set-without-answer="setWithoutAnswer"
            >
            </DelegationCard>
            <Empty v-if="documentItem.delegations.length === 0" />
          </div>
        </Col>
        <Col span="14" style="padding-left: 10px">
          <Tabs v-model:active-key="selectedTab">
            <TabPane
              :key="1"
              :tab="`${documentItem.isIncoming ? 'Входящий' : 'Исходящий'} документ`"
            >
              <PdfViewer
                v-if="opened && selectedTab === 1 && documentItem.attachmentId && isPdfVisible"
                :key="pdfKey"
                height="100%"
                :source="`${base_url}/attachment/${documentItem.attachmentId}`"
                :file-name="documentItem.name"
                @print-without-sign="printWithoutSign"
            /></TabPane>
            <TabPane :key="2" tab="Исходящий документ" v-if="documentItem.child">
              <PdfViewer
                v-if="opened && selectedTab === 2 && isPdfVisible"
                :key="pdfKey"
                height="100%"
                :source="`${base_url}/attachment/${documentItem.child.attachmentId}`"
                :file-name="documentItem.child.name"
            /></TabPane>
            <TabPane :key="4" tab="Входящий документ" v-if="documentItem.parent">
              <PdfViewer
                v-if="opened && selectedTab === 4 && isPdfVisible"
                :key="pdfKey"
                height="100%"
                :source="`${base_url}/attachment/${documentItem.parent.attachmentId}`"
                :file-name="documentItem.parent.name"
            /></TabPane>
            <TabPane
              :disabled="documentItem.isCompleted"
              :key="3"
              :tab="`Приложения (${documentItem.additionalAttachments.length})`"
              v-if="documentItem.isIncoming"
            >
              <UploadZone
                class="additional-attachment-upload"
                @uploaded="addAdditionalAttachment"
              />
              <h4>Список приложений</h4>
              <Empty v-if="documentItem.additionalAttachments.length === 0" />
              <div
                class="attachment-row"
                v-for="(attachment, index) in documentItem.additionalAttachments"
                :key="attachment.id"
              >
                <div class="name">{{ index + 1 }}. {{ attachment.fileName }}</div>

                <div class="attachment-row">
                  <Button type="text" @click="downloadAttachment(attachment)"> Скачать </Button>
                  <Button type="text" danger @click="deleteAdditionalAttachment(index)">
                    Удалить
                  </Button>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
    <CreateDelegationModal ref="createDelegationModal" @close="refreshDocument" />
    <CommentModal ref="commentModal" @close="refreshDocument" />
    <DocumentCard
      ref="documentCard"
      @close="onChildDocumentCardClose"
      @document-saved="createDocumentCommentDebounced"
    />
  </div>
</template>
<script lang="ts" setup>
import type { DocumentItem } from '@/interfaces/document-item.interface'
import {
  Modal,
  Row,
  Col,
  Dropdown,
  Button,
  Menu,
  MenuItem,
  Empty,
  TabPane,
  Tabs,
  Select
} from 'ant-design-vue'
import PdfViewer from './PdfViewer.vue'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfoStore'
import DelegationCard from './DelegationCard.vue'
import { computed, ref } from 'vue'
import useDocumentWork from '@/composables/useDocumentWork.composable'
import { useHandbookStore } from '@/stores/handbookStore'
import { useDateFormat, useDebounceFn } from '@vueuse/core'
import useDelegationWork from '@/composables/useDelegationWork.composable'
import CreateDelegationModal from './CreateDelegationModal.vue'
import CommentModal from './CommentModal.vue'
import useCardPreview from '@/composables/useCardPreview.composable'
import DocumentCard from './DocumentCard.vue'
import useDelegationCommentWork from '@/composables/useDelegationCommentWork.composable'
import { base_url } from '@/config/urls'
import { useModeStore } from '@/stores/modeStore'
import type { Attachment } from '@/interfaces/attachment.interface'
import useHttp from '@/composables/useHttp.composable'

const {
  getOneDocument,
  getNewDocumentMock,
  setDocumentReaded,
  toggleDocumentCompleted,
  saveDocument,
  stampDocument,
  setDocumentWithoutAnswer,
  createDocumentCopy
} = useDocumentWork()
const {
  setAprooved,
  setReaded,
  saveDelegationHandler,
  createInitierDelegation,
  createManagerDelegation
} = useDelegationWork()
const { isMobile } = storeToRefs(useModeStore())
const { isManager, isInitier, myId } = storeToRefs(useUserInfoStore())
const { users } = storeToRefs(useHandbookStore())
const opened = ref(false)
const canAddChild = computed(() => documentItem.value.child === null)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'registerFromDelegation', documentItem: DocumentItem): void
}>()

const createDelegationModal = ref<InstanceType<typeof CreateDelegationModal>>()

function closeHandler(e: boolean) {
  emit('close')
  opened.value = e
}
function setToInitier(delegationId: number | undefined = undefined) {
  if (createDelegationModal.value)
    createDelegationModal.value.createNewDelegation('initier', documentItem.value, delegationId)
}
function setToWorker(delegationId: number | undefined = undefined) {
  if (createDelegationModal.value)
    createDelegationModal.value.createNewDelegation('any', documentItem.value, delegationId)
}
function setToManager(delegationId: number | undefined = undefined) {
  if (createDelegationModal.value)
    createDelegationModal.value.createNewDelegation('manager', documentItem.value, delegationId)
}

async function setAprooving(delegationId: number) {
  await setAprooved({ delegationId })
  if (
    isManager.value &&
    ((documentItem.value.isIncoming === true &&
      documentItem.value.child &&
      !documentItem.value.child.isStamped) ||
      (!documentItem.value.isIncoming && !documentItem.value.isStamped))
  ) {
    await setStamp()
  }
  if (
    !isManager.value &&
    documentItem.value.delegations.find((delegation) => delegation.id === delegationId)
      ?.parentId === null &&
    documentItem.value.child
  ) {
    await sendToManagerStamp()
  }
  refreshDocument()
}
async function toggleCompleted() {
  await toggleDocumentCompleted(documentItem.value.id)
  refreshDocument()
}
async function setDocumentReadedHandler() {
  if (canSetReadingMark.value) {
    await setDocumentReaded({ document: documentItem.value })
    refreshDocument()
  }
}

async function sendToManagerStamp() {
  await saveDelegationHandler({
    ...createManagerDelegation({ document: documentItem.value }),
    description: 'Нужно утвердить',
    isNeedAprooving: true,
    toId: myId.value,
    fromId: createManagerDelegation({ document: documentItem.value }).toId
  })
  refreshDocument()
}

const commentModal = ref<InstanceType<typeof CommentModal>>()
function setCommentAndSendForAprooving(delegationId: number) {
  if (commentModal.value) commentModal.value.initComment(delegationId, false)
}
function setReturning(delegationId: number) {
  if (commentModal.value) commentModal.value.initComment(delegationId, true)
}

async function setStamp() {
  if (documentItem.value.child) {
    const attachment = await getContent(
      documentItem.value.child,
      true,
      documentItem.value.child.isRegistered
    )
    if (attachment)
      await saveDocument({ ...documentItem.value.child, attachmentId: attachment.id, attachment })
    await stampDocument({ document: documentItem.value.child })
    await saveDelegationHandler({
      ...createInitierDelegation({ document: documentItem.value.child }),
      description: 'На регистрацию'
    })
    await toggleDocumentCompleted(documentItem.value.id)
    refreshDocument()
  }
  if (!documentItem.value.isIncoming) {
    const attachment = await getContent(documentItem.value, true, documentItem.value.isRegistered)
    if (attachment)
      await saveDocument({ ...documentItem.value, attachmentId: attachment.id, attachment })
    await stampDocument({ document: documentItem.value })
    if (!documentItem.value.isRegistered)
      await saveDelegationHandler({
        ...createInitierDelegation({ document: documentItem.value }),
        description: 'На регистрацию'
      })
    if (documentItem.value.parent) await toggleDocumentCompleted(documentItem.value.parent.id)
    refreshDocument()
  }
}
const documentCard = ref<InstanceType<typeof DocumentCard>>()
const delegationIdForComment = ref(0)
const isPdfVisible = ref(true)
function createChildOutDocument(delegationId: number) {
  isPdfVisible.value = false
  delegationIdForComment.value = delegationId
  if (documentCard.value) {
    if (documentItem.value.child && documentItem.value.isIncoming) {
      return documentCard.value.updateDocument(documentItem.value.child)
    }
    if (documentItem.value && !documentItem.value.isIncoming) {
      return documentCard.value.updateDocument(documentItem.value)
    }
    documentCard.value.createDocument(
      'out',
      documentItem.value.id,
      documentItem.value.contractorId,
      documentItem.value.companyId,
      documentItem.value.additionalAttachments
    )
  }
}
function onChildDocumentCardClose() {
  isPdfVisible.value = true
  refreshDocument()
}
const { saveComment } = useDelegationCommentWork()
async function createDocumentComment() {
  const delegation = documentItem.value.delegations.find(
    (delegation) => delegation.id === delegationIdForComment.value
  )
  if (delegation && delegation.comments) {
    const sortedComments = [...delegation.comments].sort((a, b) => a.id - b.id)
    if (sortedComments[sortedComments.length - 1]?.comment === 'Прикрепил документ') return
  }
  await saveComment(delegationIdForComment.value, 'Прикрепил документ', false)
  refreshDocument()
}
const createDocumentCommentDebounced = useDebounceFn(createDocumentComment, 200)

const pdfKey = ref(0)
async function openDocument(document: DocumentItem, incardSelection = false) {
  opened.value = true
  const group = (document.group || []).sort((a, b) => a.id - b.id)
  documentItem.value = await getOneDocument(
    group.length && !incardSelection ? group[group.length - 1].id : document.id
  )
  documentItem.value.group = group
  selectedDocumentId.value = documentItem.value.id
  pdfKey.value++
  setReadedMyDelegations()
  setDocumentReadedHandler()
}
defineExpose({ openDocument, refreshDocument })

function refreshDocument() {
  if (documentItem.value.id !== 0 && opened.value) openDocument(documentItem.value, true)
}

const selectedTab = ref(1)
const documentItem = ref<DocumentItem>(getNewDocumentMock(true))
const selectedDocumentId = ref(documentItem.value.id)
const reportName = computed(
  () =>
    `№ ${documentItem.value.regnumber} от ${
      useDateFormat(documentItem.value.created, 'DD.MM.YYYY').value
    } (${documentItem.value.contractor?.name} ${documentItem.value.name})`
)
const { getContent, printWithoutSign } = useCardPreview(documentItem)

function setReadedMyDelegations() {
  const myUnreadedDelegations = documentItem.value.delegations.filter(
    (delegation) => delegation.isReaded === false && delegation.toId === myId.value
  )
  setReaded(myUnreadedDelegations)
}

function registerDocument() {
  emit('registerFromDelegation', documentItem.value)
  closeHandler(false)
}

const canSetReadingMark = computed(
  () =>
    !documentItem.value.readingMarks.find((mark) => mark.userId === myId.value) &&
    !documentItem.value.isCompleted &&
    documentItem.value.isIncoming
)
const canSetWithoutAnswer = computed(
  () =>
    !documentItem.value.readingMarks.find(
      (mark) => mark.userId === myId.value && mark.withoutAnswer
    ) &&
    !documentItem.value.isCompleted &&
    documentItem.value.isIncoming
)

async function setWithoutAnswer() {
  await setDocumentWithoutAnswer({ document: documentItem.value })
  refreshDocument()
}

function addAdditionalAttachment(attachment: Attachment) {
  documentItem.value.additionalAttachments.push(attachment)
  saveDocument(documentItem.value)
}
function deleteAdditionalAttachment(index: number) {
  documentItem.value.additionalAttachments.splice(index, 1)
  saveDocument(documentItem.value)
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

async function createDocumentCopyHandler() {
  createDocumentCopy(documentItem.value.id).then(({ data }) => {
    if (!documentItem.value.group) documentItem.value.group = []
    documentItem.value.group.push({
      ...data,
      name: `Обработка от ${useDateFormat(data.created, 'DD.MM.YYYY').value}`
    })
    selectedDocumentId.value = data.id
    openDocument({ ...data, group: documentItem.value.group }, true)
  })
}

function chooseSelectedDocument() {
  setTimeout(() => {
    const newDocument = documentItem.value.group?.find((doc) => doc.id === selectedDocumentId.value)
    if (newDocument) openDocument({ ...newDocument, group: documentItem.value.group }, true)
  })
}
</script>
<style lang="scss">
.delegation-card {
  .ant-modal {
    top: 2.5vh;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-modal-body {
    flex: 1;
  }
  .ant-tabs-tabpane.ant-tabs-tabpane-active {
    height: calc(95vh - 180px);
  }
  .preview {
    height: 100%;
    overflow: auto;
    border-radius: 5px;
    box-shadow: inset 0 0 2px #aeaeae;
    margin-bottom: 5px;
  }
}
.row {
  display: flex;
  gap: 5px;
  justify-content: space-between;
}
.row-end {
  gap: 10px;
}
.delegation-card {
  margin-bottom: 10px;
}
.delegation-list {
  overflow: auto;
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
</style>

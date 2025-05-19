<template>
  <div class="design-page">
    <div class="container">
      <div class="design-content">
        <!-- 设计工具栏 -->
        <div class="design-toolbar">
          <div class="tool-group">
            <el-button :icon="Back" @click="handleBack">返回</el-button>
          </div>
          <div class="tool-group">
            <el-button-group>
              <el-button :icon="Upload" @click="handleUpload">上传图片</el-button>
              <el-button :icon="Picture" @click="handleAddText">添加文字</el-button>
              <el-button :icon="Delete" @click="handleClear">清空画布</el-button>
            </el-button-group>
          </div>
          <div class="tool-group">
            <el-button-group>
              <el-button :icon="ArrowLeft" @click="handleUndo" :disabled="!canUndo">返回上一步</el-button>
              <el-button :icon="ArrowRight" @click="handleRedo" :disabled="!canRedo">返回下一步</el-button>
            </el-button-group>
          </div>
          <div class="tool-group">
            <el-button type="primary" @click="handleSave">保存设计</el-button>
          </div>
        </div>

        <!-- 设计区域 -->
        <div class="design-area">
          <div class="canvas-container">
            <canvas 
              ref="canvasRef" 
              class="design-canvas"
              @mousemove="handleCanvasMouseMove"
              @mouseleave="handleCanvasMouseLeave"
            ></canvas>
          </div>
        </div>

        <!-- 属性面板 -->
        <div class="properties-panel">
          <el-tabs>
            <el-tab-pane label="图层">
              <div class="layer-list">
                <div
                  v-for="(layer, index) in layers"
                  :key="index"
                  class="layer-item"
                  :class="{ active: currentLayer === index }"
                  @click="selectLayer(index)"
                >
                  <div class="layer-info">
                    <el-icon class="layer-icon">
                      <component :is="layer.type === 'text' ? 'Document' : 'Picture'" />
                    </el-icon>
                  <span class="layer-name">{{ layer.name }}</span>
                  </div>
                  <div class="layer-actions">
                    <el-button
                      :icon="ArrowUp"
                      circle
                      size="small"
                      @click.stop="moveLayer(index, 'up')"
                      :disabled="index === 0"
                    />
                    <el-button
                      :icon="ArrowDown"
                      circle
                      size="small"
                      @click.stop="moveLayer(index, 'down')"
                      :disabled="index === layers.length - 1"
                    />
                    <el-button
                      :icon="Delete"
                      circle
                      size="small"
                      @click.stop="deleteLayer(index)"
                    />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性">
              <div v-if="currentLayer !== null && layers[currentLayer].type === 'text'" class="property-group">
                <h4>文字属性</h4>
                <el-form label-position="top">
                  <el-form-item label="文字内容">
                    <el-input v-model="layers[currentLayer].text" @change="updateLayer" />
                  </el-form-item>
                  <el-form-item label="字体">
                    <el-select v-model="layers[currentLayer].font" @change="updateLayer">
                      <el-option label="微软雅黑" value="Microsoft YaHei" />
                      <el-option label="宋体" value="SimSun" />
                      <el-option label="黑体" value="SimHei" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="字号">
                    <el-input-number v-model="layers[currentLayer].fontSize" @change="updateLayer" />
                  </el-form-item>
                  <el-form-item label="颜色">
                    <el-color-picker v-model="layers[currentLayer].color" @change="updateLayer" />
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 上传图片对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传图片"
      width="500px"
    >
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleImageChange"
        accept="image/*"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将图片拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpload">
            确认上传
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加文字对话框 -->
    <el-dialog
      v-model="textDialogVisible"
      title="添加文字"
      width="500px"
    >
      <el-form :model="textForm" label-position="top">
        <el-form-item label="文字内容" required>
          <el-input v-model="textForm.text" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="字体">
          <el-select v-model="textForm.font">
            <el-option label="微软雅黑" value="Microsoft YaHei" />
            <el-option label="宋体" value="SimSun" />
            <el-option label="黑体" value="SimHei" />
          </el-select>
        </el-form-item>
        <el-form-item label="字号">
          <el-input-number v-model="textForm.fontSize" :min="12" :max="72" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="textForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="textDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddText">
            确认添加
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加文字编辑对话框 -->
    <el-dialog
      v-model="editTextDialogVisible"
      title="编辑文字"
      width="500px"
    >
      <el-form :model="editTextForm" label-position="top">
        <el-form-item label="文字内容" required>
          <el-input v-model="editTextForm.text" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="字体">
          <el-select v-model="editTextForm.font">
            <el-option label="微软雅黑" value="Microsoft YaHei" />
            <el-option label="宋体" value="SimSun" />
            <el-option label="黑体" value="SimHei" />
          </el-select>
        </el-form-item>
        <el-form-item label="字号">
          <el-input-number v-model="editTextForm.fontSize" :min="12" :max="72" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="editTextForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTextDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditText">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Picture,
  Delete,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  UploadFilled,
  Back,
} from '@element-plus/icons-vue'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const uploadDialogVisible = ref(false)
const textDialogVisible = ref(false)
const editTextDialogVisible = ref(false)
const currentLayer = ref<number | null>(null)
const canUndo = ref(false)
const canRedo = ref(false)

// 图层数据
const layers = ref<Array<{
  type: 'image' | 'text'
  name: string
  x: number
  y: number
  width: number
  height: number
  text?: string
  font?: string
  fontSize?: number
  color?: string
  image?: HTMLImageElement
  imageData?: string
  rotation?: number
  scale?: number
}>>([])

// 文字表单
const textForm = ref({
  text: '',
  font: 'Microsoft YaHei',
  fontSize: 24,
  color: '#000000',
  rotation: 0,
  scale: 1
})

// 修改历史记录相关状态
const history = ref<Array<{
  layers: typeof layers.value
  timestamp: number
}>>([])
const historyIndex = ref(-1)

// 添加文字编辑相关状态
const editTextForm = ref({
  text: '',
  font: 'Microsoft YaHei',
  fontSize: 24,
  color: '#000000'
})
const editingLayerIndex = ref<number | null>(null)

// 添加图片加载函数
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// 修改保存历史记录函数
const saveToHistory = () => {
  // 如果当前不是最新状态，删除当前位置之后的历史记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  // 保存当前状态，包括图片的 base64 数据
  const currentState = {
    layers: layers.value.map(layer => {
      if (layer.type === 'image' && layer.image) {
        // 创建临时 canvas 来获取图片的 base64 数据
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = layer.image.width
        tempCanvas.height = layer.image.height
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(layer.image, 0, 0)
          return {
            ...layer,
            imageData: tempCanvas.toDataURL('image/png')
          }
        }
      }
      return layer
    }),
    timestamp: Date.now()
  }
  
  history.value.push(currentState)
  historyIndex.value = history.value.length - 1
  
  // 更新撤销/重做按钮状态
  canUndo.value = historyIndex.value > 0
  canRedo.value = false
}

// 上传图片相关
const handleUpload = () => {
  uploadDialogVisible.value = true
}

const handleImageChange = async (file: any) => {
  try {
  const reader = new FileReader()
    reader.onload = async (e) => {
    const img = new Image()
    img.onload = () => {
        const canvas = canvasRef.value
        if (!canvas) return
        
      // 创建新图层
      layers.value.push({
        type: 'image',
        name: file.name,
        x: 0,
        y: 0,
          width: canvas.width,
          height: canvas.height,
        image: img
      })
        // 移除选中图层，因为这是上传操作
        currentLayer.value = null
        saveToHistory()
      updateCanvas()
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
  } catch (error) {
    console.error('Failed to load image:', error)
    ElMessage.error('图片加载失败')
  }
}

const confirmUpload = () => {
  uploadDialogVisible.value = false
  updateCanvas()
}

// 文字相关
const handleAddText = () => {
  textForm.value = {
    text: '',
    font: 'Microsoft YaHei',
    fontSize: 24,
    color: '#000000',
    rotation: 0,
    scale: 1
  }
  textDialogVisible.value = true
}

const confirmAddText = () => {
  if (!textForm.value.text) {
    ElMessage.warning('请输入文字内容')
    return
  }

  layers.value.push({
    type: 'text',
    name: '文字图层',
    x: canvasRef.value ? canvasRef.value.width / 2 : 250,
    y: canvasRef.value ? canvasRef.value.height / 2 : 350,
    width: 200,
    height: 50,
    text: textForm.value.text,
    font: textForm.value.font,
    fontSize: textForm.value.fontSize,
    color: textForm.value.color,
    rotation: textForm.value.rotation,
    scale: textForm.value.scale
  })

  currentLayer.value = layers.value.length - 1
  textDialogVisible.value = false
  saveToHistory()
  updateCanvas()
}

// 图层操作
const selectLayer = (index: number) => {
  currentLayer.value = index
}

const moveLayer = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  const layer = layers.value[index]
  layers.value.splice(index, 1)
  layers.value.splice(newIndex, 0, layer)
  currentLayer.value = newIndex
  saveToHistory() // 保存到历史记录
  updateCanvas()
}

const deleteLayer = (index: number) => {
  ElMessageBox.confirm('确定要删除该图层吗？', '提示', {
    type: 'warning'
  }).then(() => {
    // 删除图层
    layers.value.splice(index, 1)
    if (currentLayer.value === index) {
      currentLayer.value = layers.value.length > 0 ? layers.value.length - 1 : null
    }
    
    // 保存到历史记录
    saveToHistory()
    updateCanvas()
  })
}

const updateLayer = () => {
  if (currentLayer.value !== null) {
    const layer = layers.value[currentLayer.value]
    if (layer.type === 'text') {
      // 确保文字属性更新
      layer.text = layer.text
      layer.font = layer.font
      layer.fontSize = layer.fontSize
      layer.color = layer.color
      layer.rotation = layer.rotation
      layer.scale = layer.scale
    }
  }
  updateCanvas()
}

// 画布操作
const handleClear = () => {
  ElMessageBox.confirm('确定要清空画布吗？', '提示', {
    type: 'warning'
  }).then(() => {
    layers.value = []
    currentLayer.value = null
    updateCanvas()
  })
}

// 修改撤销功能
const handleUndo = async () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    const previousState = history.value[historyIndex.value]
    if (previousState) {
      // 保存当前选中的图层索引
      const currentSelectedIndex = currentLayer.value
      
      // 恢复之前的状态，包括重新加载图片
      const restoredLayers = await Promise.all(previousState.layers.map(async layer => {
        if (layer.type === 'image' && layer.imageData) {
          try {
            const img = await loadImage(layer.imageData)
            return {
              ...layer,
              image: img
            }
          } catch (error) {
            console.error('Failed to load image:', error)
            return layer
          }
        }
        return layer
      }))
      
      layers.value = restoredLayers
      
      // 尝试恢复选中的图层
      if (currentSelectedIndex !== null && currentSelectedIndex < layers.value.length) {
        currentLayer.value = currentSelectedIndex
      } else {
        currentLayer.value = layers.value.length > 0 ? layers.value.length - 1 : null
      }
      
      // 更新按钮状态
      canUndo.value = historyIndex.value > 0
      canRedo.value = true
      
      // 更新画布
      updateCanvas()
    }
  }
}

// 修改重做功能
const handleRedo = async () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    const nextState = history.value[historyIndex.value]
    if (nextState) {
      // 保存当前选中的图层索引
      const currentSelectedIndex = currentLayer.value
      
      // 恢复下一个状态，包括重新加载图片
      const restoredLayers = await Promise.all(nextState.layers.map(async layer => {
        if (layer.type === 'image' && layer.imageData) {
          try {
            const img = await loadImage(layer.imageData)
            return {
              ...layer,
              image: img
            }
          } catch (error) {
            console.error('Failed to load image:', error)
            return layer
          }
        }
        return layer
      }))
      
      layers.value = restoredLayers
      
      // 尝试恢复选中的图层
      if (currentSelectedIndex !== null && currentSelectedIndex < layers.value.length) {
        currentLayer.value = currentSelectedIndex
      } else {
        currentLayer.value = layers.value.length > 0 ? layers.value.length - 1 : null
      }
      
      // 更新按钮状态
      canUndo.value = true
      canRedo.value = historyIndex.value < history.value.length - 1
      
      // 更新画布
      updateCanvas()
    }
  }
}

const handleSave = () => {
  // TODO: 实现保存功能
  ElMessage.success('设计已保存')
}

// 修改返回函数
const handleBack = () => {
  // 使用 router.back() 而不是重置数据
  router.back()
}

// 更新画布
const updateCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制卡牌背景（带圆角）
  const radius = 20
  const padding = 20
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(radius + padding, padding)
  ctx.lineTo(canvas.width - radius - padding, padding)
  ctx.quadraticCurveTo(canvas.width - padding, padding, canvas.width - padding, radius + padding)
  ctx.lineTo(canvas.width - padding, canvas.height - radius - padding)
  ctx.quadraticCurveTo(canvas.width - padding, canvas.height - padding, canvas.width - radius - padding, canvas.height - padding)
  ctx.lineTo(radius + padding, canvas.height - padding)
  ctx.quadraticCurveTo(padding, canvas.height - padding, padding, canvas.height - radius - padding)
  ctx.lineTo(padding, radius + padding)
  ctx.quadraticCurveTo(padding, padding, radius + padding, padding)
  ctx.closePath()
  ctx.fill()

  // 绘制卡牌边框
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制所有图层
  layers.value.forEach(layer => {
    ctx.save()

    if (layer.type === 'text') {
      // 设置文字变换
      ctx.translate(layer.x, layer.y)
      ctx.rotate((layer.rotation || 0) * Math.PI / 180)
      ctx.scale(layer.scale || 1, layer.scale || 1)
      
      // 绘制文字
      ctx.font = `${layer.fontSize}px ${layer.font}`
      ctx.fillStyle = layer.color || '#000000'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(layer.text || '', 0, 0)

      // 如果当前图层被选中，绘制控制点
      if (currentLayer.value === layers.value.indexOf(layer)) {
        // 绘制边框
        ctx.strokeStyle = '#409EFF'
        ctx.lineWidth = 1
        ctx.strokeRect(-layer.width/2, -layer.height/2, layer.width, layer.height)
        
        // 绘制控制点
        const points = [
          { x: -layer.width/2, y: -layer.height/2 }, // 左上
          { x: layer.width/2, y: -layer.height/2 },  // 右上
          { x: layer.width/2, y: layer.height/2 },   // 右下
          { x: -layer.width/2, y: layer.height/2 },  // 左下
          { x: 0, y: -layer.height/2 - 20 }          // 旋转控制点
        ]
        
        points.forEach((point) => {
          ctx.fillStyle = '#409EFF'
          ctx.beginPath()
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    } else if (layer.type === 'image' && layer.image) {
      // 计算图片填充尺寸
      const canvasWidth = canvas.width - padding * 2
      const canvasHeight = canvas.height - padding * 2
      const imgRatio = layer.image.width / layer.image.height
      const canvasRatio = canvasWidth / canvasHeight

      let width, height
      if (imgRatio > canvasRatio) {
        height = canvasHeight
        width = height * imgRatio
      } else {
        width = canvasWidth
        height = width / imgRatio
      }

      // 居中绘制图片
      const x = (canvas.width - width) / 2
      const y = (canvas.height - height) / 2
      
      // 创建圆角裁剪区域
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(radius + padding, padding)
      ctx.lineTo(canvas.width - radius - padding, padding)
      ctx.quadraticCurveTo(canvas.width - padding, padding, canvas.width - padding, radius + padding)
      ctx.lineTo(canvas.width - padding, canvas.height - radius - padding)
      ctx.quadraticCurveTo(canvas.width - padding, canvas.height - padding, canvas.width - radius - padding, canvas.height - padding)
      ctx.lineTo(radius + padding, canvas.height - padding)
      ctx.quadraticCurveTo(padding, canvas.height - padding, padding, canvas.height - radius - padding)
      ctx.lineTo(padding, radius + padding)
      ctx.quadraticCurveTo(padding, padding, radius + padding, padding)
      ctx.closePath()
      ctx.clip()
      
      // 绘制图片
      ctx.drawImage(layer.image, x, y, width, height)
      ctx.restore()
    }

    ctx.restore()
  })
}

// 添加鼠标移动处理函数
const handleCanvasMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 检查是否在文字控制点上
  for (let i = layers.value.length - 1; i >= 0; i--) {
    const layer = layers.value[i]
    if (layer.type === 'text') {
      // 检查旋转控制点
      const rotationPoint = { x: 0, y: -layer.height/2 - 20 }
      if (isPointInControlPoint(x, y, layer, rotationPoint)) {
        canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\' fill=\'%23409EFF\'/><path d=\'M12 6v6l4 2\' stroke=\'%23409EFF\' stroke-width=\'2\' fill=\'none\'/></svg>") 12 12, auto'
        return
      }

      // 检查缩放控制点
      const scalePoints = [
        { x: layer.width/2, y: layer.height/2 },    // 右下
        { x: -layer.width/2, y: -layer.height/2 },  // 左上
        { x: layer.width/2, y: -layer.height/2 },   // 右上
        { x: -layer.width/2, y: layer.height/2 }    // 左下
      ]
      for (const point of scalePoints) {
        if (isPointInControlPoint(x, y, layer, point)) {
          canvas.style.cursor = 'nwse-resize'
          return
        }
      }

      // 检查是否在文字区域内
      if (isPointInLayer(x, y, layer)) {
        canvas.style.cursor = 'move'
        return
      }
    }
  }

  // 默认光标
  canvas.style.cursor = 'default'
}

// 添加鼠标离开处理函数
const handleCanvasMouseLeave = () => {
  if (!canvasRef.value) return
  canvasRef.value.style.cursor = 'default'
}

// 修改画布事件处理
const setupCanvasEvents = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  let isDragging = false
  let isRotating = false
  let isScaling = false
  let startX = 0
  let startY = 0
  let currentLayerIndex: number | null = null
  let dragType: 'move' | 'rotate' | 'scale' | null = null
  let startRotation = 0
  let startScale = 1
  let lastAngle = 0
  let lastRotation = 0
  let lastState: any = null

  // 保存操作开始前的状态
  const saveStartState = () => {
    lastState = JSON.parse(JSON.stringify(layers.value))
  }

  // 添加双击事件监听器
  canvas.addEventListener('dblclick', handleDoubleClick)

  // 鼠标按下事件
  canvas.addEventListener('mousedown', (e) => {
    if (!layers.value.length) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 从上层向下检查是否点击到图层
    for (let i = layers.value.length - 1; i >= 0; i--) {
      const layer = layers.value[i]
      if (layer.type === 'text') {
        // 检查是否点击到旋转控制点
        const rotationPoint = { x: 0, y: -layer.height/2 - 20 }
        if (isPointInControlPoint(x, y, layer, rotationPoint)) {
          isRotating = true
          currentLayerIndex = i
          startX = x
          startY = y
          startRotation = layer.rotation || 0
          lastRotation = startRotation
          lastAngle = Math.atan2(y - layer.y, x - layer.x)
          dragType = 'rotate'
          selectLayer(i)
          saveStartState()
          break
        }
        
        // 检查是否点击到缩放控制点
        const scalePoints = [
          { x: layer.width/2, y: layer.height/2 },    // 右下
          { x: -layer.width/2, y: -layer.height/2 },  // 左上
          { x: layer.width/2, y: -layer.height/2 },   // 右上
          { x: -layer.width/2, y: layer.height/2 }    // 左下
        ]
        
        for (const point of scalePoints) {
          if (isPointInControlPoint(x, y, layer, point)) {
            isScaling = true
            currentLayerIndex = i
            startX = x
            startY = y
            startScale = layer.scale || 1
            dragType = 'scale'
            selectLayer(i)
            saveStartState()
            break
          }
        }
        
        // 检查是否点击到文字区域
        if (isPointInLayer(x, y, layer)) {
          isDragging = true
          currentLayerIndex = i
          startX = x - layer.x
          startY = y - layer.y
          dragType = 'move'
          selectLayer(i)
          saveStartState()
          break
        }
      }
    }
  })

  // 鼠标移动事件
  canvas.addEventListener('mousemove', (e) => {
    if (!currentLayerIndex) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const layer = layers.value[currentLayerIndex]
    
    if (layer.type === 'text') {
      if (isDragging && dragType === 'move') {
        layer.x = x - startX
        layer.y = y - startY
        updateCanvas()
      } else if (isRotating && dragType === 'rotate') {
        const currentAngle = Math.atan2(y - layer.y, x - layer.x)
        const angleDiff = currentAngle - lastAngle
        const rotationDiff = angleDiff * 180 / Math.PI
        
        // 计算新的旋转角度
        let newRotation = lastRotation + rotationDiff
        
        // 确保角度在 0-360 度之间
        while (newRotation < 0) newRotation += 360
        while (newRotation >= 360) newRotation -= 360
        
        layer.rotation = newRotation
        lastRotation = newRotation
        lastAngle = currentAngle
        updateCanvas()
      } else if (isScaling && dragType === 'scale') {
        const dx = x - layer.x
        const dy = y - layer.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const baseDistance = Math.sqrt(
          Math.pow(startX - layer.x, 2) + 
          Math.pow(startY - layer.y, 2)
        )
        const scaleFactor = distance / baseDistance
        layer.scale = Math.max(0.1, Math.min(3, startScale * scaleFactor))
        updateCanvas()
      }
    }
  })

  // 鼠标松开事件
  canvas.addEventListener('mouseup', () => {
    if (isDragging || isRotating || isScaling) {
      // 检查状态是否真的改变了
      const currentState = JSON.stringify(layers.value)
      const lastStateStr = JSON.stringify(lastState)
      if (currentState !== lastStateStr) {
        saveToHistory()
      }
    }
    isDragging = false
    isRotating = false
    isScaling = false
    dragType = null
    currentLayerIndex = null
    lastState = null
  })

  // 点击画布空白区域
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    let clickedOnLayer = false
    for (const layer of layers.value) {
      if (layer.type === 'text' && isPointInLayer(x, y, layer)) {
        clickedOnLayer = true
        break
      }
    }
    
    if (!clickedOnLayer) {
      currentLayer.value = null
      updateCanvas()
    }
  })
}

// 修改检查点是否在控制点内的函数
const isPointInControlPoint = (x: number, y: number, layer: any, point: { x: number, y: number }) => {
  // 将点转换到图层坐标系
  const dx = x - layer.x
  const dy = y - layer.y
  const rotation = (layer.rotation || 0) * Math.PI / 180
  const rotatedX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation)
  const rotatedY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation)
  
  const pointX = point.x * (layer.scale || 1)
  const pointY = point.y * (layer.scale || 1)
  
  const distance = Math.sqrt(
    Math.pow(rotatedX - pointX, 2) + 
    Math.pow(rotatedY - pointY, 2)
  )
  return distance <= 8
}

// 修改双击编辑处理函数
const handleDoubleClick = (e: MouseEvent) => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 检查是否双击到文字图层
  for (let i = layers.value.length - 1; i >= 0; i--) {
    const layer = layers.value[i]
    if (layer.type === 'text' && isPointInLayer(x, y, layer)) {
      // 打开编辑对话框，但不选中图层
      editTextForm.value = {
        text: layer.text || '',
        font: layer.font || 'Microsoft YaHei',
        fontSize: layer.fontSize || 24,
        color: layer.color || '#000000'
      }
      editingLayerIndex.value = i
      editTextDialogVisible.value = true
      break
    }
  }
}

// 修改确认编辑处理函数
const confirmEditText = () => {
  if (editingLayerIndex.value === null) return
  const layer = layers.value[editingLayerIndex.value]
  if (layer.type === 'text') {
    // 保存编辑前的状态
    // const previousState = JSON.parse(JSON.stringify(layers.value))
    
    // 更新文字属性
    layer.text = editTextForm.value.text
    layer.font = editTextForm.value.font
    layer.fontSize = editTextForm.value.fontSize
    layer.color = editTextForm.value.color
    
    // 保存到历史记录
    saveToHistory()
    updateCanvas()
  }
  editTextDialogVisible.value = false
  editingLayerIndex.value = null
}

// 检查点是否在图层内
const isPointInLayer = (x: number, y: number, layer: any) => {
  if (layer.type !== 'text') return false
  
  const centerX = layer.x
  const centerY = layer.y
  const width = layer.width
  const height = layer.height
  
  // 考虑旋转和缩放
  const rotation = (layer.rotation || 0) * Math.PI / 180
  const scale = layer.scale || 1
  
  // 将点转换到图层坐标系
  const dx = x - centerX
  const dy = y - centerY
  
  // 应用旋转
  const rotatedX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation)
  const rotatedY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation)
  
  // 应用缩放
  const scaledX = rotatedX / scale
  const scaledY = rotatedY / scale
  
  // 检查点是否在矩形内
  return Math.abs(scaledX) <= width / 2 && Math.abs(scaledY) <= height / 2
}

// 初始化
onMounted(() => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布大小为标准扑克牌尺寸 (63mm x 88mm)
  canvas.width = 315
  canvas.height = 440

  // 添加画布事件监听
  setupCanvasEvents()

  // 保存初始状态
  if (layers.value.length > 0) {
    saveToHistory()
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/styles/variables.scss" as *;

.design-page {
  padding: 20px 0;

  .design-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    background: #fff;
    border-radius: $border-radius-base;
    padding: 20px;
    box-shadow: $box-shadow-light;
    max-width: 1200px;
    margin: 0 auto;

    .design-toolbar {
      grid-column: 1 / -1;
      display: flex;
      gap: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid $border-color-light;

      .tool-group {
        display: flex;
        gap: 10px;
      }
    }

    .design-area {
      position: relative;
      background: $background-color;
      border-radius: $border-radius-base;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      .canvas-container {
        background: #fff;
        border: 1px solid $border-color;
        border-radius: $border-radius-base;
        padding: 10px;
        box-shadow: $box-shadow-light;

        .design-canvas {
          width: 315px;
          height: 440px;
          display: block;
          border-radius: 20px;
          overflow: hidden;
        }
      }
    }

    .properties-panel {
      background: $background-color;
      border-radius: $border-radius-base;
      padding: 20px;
      width: 300px;

      .layer-list {
        .layer-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          margin-bottom: 8px;
          border-radius: $border-radius-small;
          background: #fff;
          border: 1px solid $border-color-light;
          transition: all 0.3s ease;

          &:hover {
            border-color: $primary-color;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          }

          &.active {
            border-color: $primary-color;
            background-color: color.adjust($primary-color, $lightness: 95%);
          }

          .layer-info {
            display: flex;
            align-items: center;
            gap: 8px;

            .layer-icon {
              font-size: 16px;
              color: $text-color-secondary;
          }

          .layer-name {
              font-size: 14px;
            color: $text-color-regular;
            }
          }

          .layer-actions {
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          &:hover .layer-actions {
            opacity: 1;
          }
        }
      }
    }
  }
}

.upload-area {
  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .design-page {
    .design-content {
      grid-template-columns: 1fr;

      .design-toolbar {
        flex-wrap: wrap;
      }

      .design-area {
        min-height: 400px;
      }
    }
  }
}
</style> 
// 创建一个名为InputRecorder的类
class InputRecorder {
  // 构造函数接受三个参数：输入元素、录制按钮和回放按钮
  constructor(inputElement, recordButton, playbackButton) {
    // 将传入的参数保存为类的属性
    this.inputElement = inputElement;
    this.recordButton = recordButton;
    this.playbackButton = playbackButton;
    // 用于记录录制的内容的数组
    this.recordedContent = [];
    // 创建一个 MutationObserver 监听器
    this.observer = new MutationObserver(this.handleMutation.bind(this));

    // 为录制按钮添加“点击”事件监听器
    this.recordButton.addEventListener(
      "click",
      this.handleRecordClick.bind(this)
    );
    // 为回放按钮添加“点击”事件监听器
    this.playbackButton.addEventListener(
      "click",
      this.handlePlaybackClick.bind(this)
    );
    // 为输入元素添加“输入”事件监听器
    this.inputElement.addEventListener("input", this.handleInput.bind(this));
  }

  // 当输入元素的子节点发生变化时，将新添加的节点值存储到 recordedContent 数组中
  handleMutation(mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        const newValue = mutation.addedNodes[0].nodeValue;
        this.recordedContent.push(newValue);
      }
    });
  }

  // 点击录制按钮后，将 recordedContent 数组重置为空，禁用录制按钮，启用回放按钮，并开始监听输入元素的变化
  handleRecordClick() {
    this.recordedContent = [];
    this.disableButton(this.recordButton);
    this.enableButton(this.playbackButton);
    this.observer.observe(this.inputElement, { childList: true });
  }

  // 点击回放按钮后，禁用录制和回放按钮，并将 recordedContent 数组中的内容依次填入输入元素
  handlePlaybackClick() {
    let i = 0;
    this.disableButton(this.recordButton);
    this.disableButton(this.playbackButton);

    const intervalId = setInterval(() => {
      if (i >= this.recordedContent.length) {
        clearInterval(intervalId);
        this.enableButton(this.recordButton);
        this.enableButton(this.playbackButton);
      } else {
        this.inputElement.value = this.recordedContent[i];
        this.inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        i++;
      }
    }, 200);
  }

  // 当输入元素的值发生变化时，将新值存储到 recordedContent 数组中（排除撤销和重做操作）
  handleInput(event) {
    if (
      event.inputType !== "historyUndo" &&
      event.inputType !== "historyRedo"
    ) {
      this.recordedContent.push(event.target.value);
    }
  }

  // 禁用按钮
  disableButton(button) {
    button.disabled = true;
    button.style.opacity = 0.5;
  }

  // 启用按钮
  enableButton(button) {
    button.disabled = false;
    button.style.opacity = 1;
  }
}

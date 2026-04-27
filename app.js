const catalog = window.doorCatalog;

const state = {
  baseId: catalog.bases[0]?.id ?? "",
  overlayId: "none",
  overlayMode: "pattern",
  lineColor: catalog.lineColors[0]?.id ?? "B",
  accessoryType: catalog.accessories[0]?.type ?? "",
  accessoryColor: catalog.accessoryColors[0]?.id ?? "white",
  selectedAccessoryInstanceId: "",
  accessoryInstances: []
};

const baseOptions = document.getElementById("baseOptions");
const overlayOptions = document.getElementById("overlayOptions");
const overlayModeOptions = document.getElementById("overlayModeOptions");
const lineColorOptions = document.getElementById("lineColorOptions");
const accessoryTypeOptions = document.getElementById("accessoryTypeOptions");
const accessoryColorOptions = document.getElementById("accessoryColorOptions");
const accessoryOptions = document.getElementById("accessoryOptions");
const baseImage = document.getElementById("baseImage");
const overlayImage = document.getElementById("overlayImage");
const accessoryCanvas = document.getElementById("accessoryCanvas");
const doorFrame = document.querySelector(".door-frame");
const selectionTitle = document.getElementById("selectionTitle");
const baseLabel = document.getElementById("baseLabel");
const overlayLabel = document.getElementById("overlayLabel");
const accessoryLabel = document.getElementById("accessoryLabel");
const emptyOverlayBadge = document.getElementById("emptyOverlayBadge");
const resetButton = document.getElementById("resetButton");
const clearAccessoryButton = document.getElementById("clearAccessoryButton");
const clearAllAccessoriesButton = document.getElementById("clearAllAccessoriesButton");
const exportPngButton = document.getElementById("exportPngButton");
const positionControls = document.getElementById("positionControls");

const dragState = {
  active: false,
  instanceId: ""
};

function getBaseById(id) {
  return catalog.bases.find((item) => item.id === id);
}

function getOverlayById(id) {
  return catalog.overlays.find((item) => item.id === id);
}

function getLineOverlayById(id) {
  return catalog.lineOverlays.find((item) => item.id === id);
}

function getLineColorById(id) {
  return catalog.lineColors.find((color) => color.id === id);
}

function getAccessoryGroup(type) {
  return catalog.accessories.find((group) => group.type === type);
}

function getAccessoryById(id) {
  return catalog.accessories.flatMap((group) => group.items).find((item) => item.id === id);
}

function getAccessoryColorById(id) {
  return catalog.accessoryColors.find((color) => color.id === id);
}

function getAccessoryGroupByItemId(id) {
  return catalog.accessories.find((group) => group.items.some((item) => item.id === id));
}

function getSelectedAccessoryInstance() {
  return state.accessoryInstances.find((instance) => instance.instanceId === state.selectedAccessoryInstanceId);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAccessoryScale(accessory) {
  if (!accessory?.size) {
    return {
      width: 55,
      height: 28
    };
  }

  return {
    width: (accessory.size.width / catalog.doorSize.width) * 100,
    height: (accessory.size.height / catalog.doorSize.height) * 100
  };
}

function updateAccessoryNodePosition(instance) {
  const node = accessoryCanvas.querySelector(`[data-instance-id="${instance.instanceId}"]`);

  if (!node) {
    return;
  }

  node.style.left = `${instance.x}%`;
  node.style.top = `${instance.y}%`;
  node.style.transform = `translate(-50%, -50%) rotate(${instance.rotation}deg)`;
}

function setAccessoryPositionFromPointer(event, instance) {
  const rect = doorFrame.getBoundingClientRect();
  instance.x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  instance.y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
  updateAccessoryNodePosition(instance);
}

function moveAccessory(direction) {
  const instance = getSelectedAccessoryInstance();

  if (!instance) {
    return;
  }

  const step = 3;
  const rotationStep = 15;

  if (direction === "center") {
    instance.x = 50;
    instance.y = 50;
  }

  if (direction === "up") {
    instance.y = clamp(instance.y - step, 0, 100);
  }

  if (direction === "down") {
    instance.y = clamp(instance.y + step, 0, 100);
  }

  if (direction === "left") {
    instance.x = clamp(instance.x - step, 0, 100);
  }

  if (direction === "right") {
    instance.x = clamp(instance.x + step, 0, 100);
  }

  if (direction === "rotate-left") {
    instance.rotation -= rotationStep;
  }

  if (direction === "rotate-right") {
    instance.rotation += rotationStep;
  }

  if (direction === "rotate-reset") {
    instance.rotation = 0;
  }

  updateAccessoryNodePosition(instance);
  renderAccessorySummary();
  syncActiveState();
}

function createCard(item, type) {
  if (type === "base") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "base-swatch";
    button.dataset.id = item.id;
    button.dataset.type = type;
    button.innerHTML = `
      <div class="base-swatch-thumb">
        <img src="${item.image}" alt="${item.name} 底圖縮圖">
      </div>
      <span class="base-swatch-label">${item.name}</span>
    `;

    button.addEventListener("click", () => {
      state.baseId = item.id;
      render();
    });

    return button;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-card";
  button.dataset.id = item.id;
  button.dataset.type = type;

  const thumb = item.preview || item.image;
  const fallbackLabel = type === "base" ? `${item.name} 底圖` : `${item.name} 樣式`;

  button.innerHTML = `
    <div class="card-thumb">
      ${thumb ? `<img src="${thumb}" alt="${fallbackLabel}">` : `<div class="card-thumb placeholder"></div>`}
    </div>
    <div class="card-text">
      <span class="card-title">${item.name}</span>
      <p class="card-caption">${item.description}</p>
    </div>
  `;

  button.addEventListener("click", () => {
    if (type === "base") {
      state.baseId = item.id;
    } else {
      state.overlayId = item.id;
    }
    render();
  });

  return button;
}

function createAccessoryTypeButton(group) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "segment-button";
  button.dataset.type = group.type;
  button.textContent = group.label;

  button.addEventListener("click", () => {
    state.accessoryType = group.type;
    renderAccessoryOptions();
    render();
  });

  return button;
}

function createAccessoryColorButton(color) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "accessory-color";
  button.dataset.color = color.id;
  button.textContent = color.name;

  button.addEventListener("click", () => {
    state.accessoryColor = color.id;
    const instance = getSelectedAccessoryInstance();

    if (instance) {
      instance.color = color.id;
    }

    render();
  });

  return button;
}

function createLineColorButton(color) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "accessory-color line-color";
  button.dataset.lineColor = color.id;
  button.textContent = color.name;

  button.addEventListener("click", () => {
    state.lineColor = color.id;
    renderOverlayOptions();
    render();
  });

  return button;
}

function createAccessoryCard(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "accessory-option";
  button.dataset.id = item.id;

  button.innerHTML = `
    <img src="${item.images[state.accessoryColor]}" alt="${item.name} 配件縮圖">
    <span>${item.name}</span>
  `;

  button.addEventListener("click", () => {
    const instance = {
      instanceId: `accessory-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      accessoryId: item.id,
      color: state.accessoryColor,
      x: 50,
      y: 50,
      rotation: 0
    };

    state.accessoryInstances.push(instance);
    state.selectedAccessoryInstanceId = instance.instanceId;
    render();
  });

  return button;
}

function createLineOverlayCard(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-card";
  button.dataset.id = item.id;
  button.dataset.type = "overlay";

  const image = item.images[state.lineColor];

  button.innerHTML = `
    <div class="card-thumb">
      <img src="${image}" alt="${item.name}">
    </div>
    <div class="card-text">
      <span class="card-title">${item.name}</span>
      <p class="card-caption">${item.description}</p>
    </div>
  `;

  button.addEventListener("click", () => {
    state.overlayId = item.id;
    render();
  });

  return button;
}

function renderOptions() {
  baseOptions.innerHTML = "";
  accessoryTypeOptions.innerHTML = "";
  accessoryColorOptions.innerHTML = "";
  lineColorOptions.innerHTML = "";

  catalog.bases.forEach((base) => {
    baseOptions.appendChild(createCard(base, "base"));
  });

  catalog.lineColors.forEach((color) => {
    lineColorOptions.appendChild(createLineColorButton(color));
  });

  renderOverlayOptions();

  catalog.accessories.forEach((group) => {
    accessoryTypeOptions.appendChild(createAccessoryTypeButton(group));
  });

  catalog.accessoryColors.forEach((color) => {
    accessoryColorOptions.appendChild(createAccessoryColorButton(color));
  });

  renderAccessoryOptions();
}

function renderOverlayOptions() {
  overlayOptions.innerHTML = "";
  lineColorOptions.hidden = state.overlayMode !== "line";

  if (state.overlayMode === "line") {
    catalog.lineOverlays.forEach((line) => {
      overlayOptions.appendChild(createLineOverlayCard(line));
    });
    return;
  }

  catalog.overlays.forEach((overlay) => {
    overlayOptions.appendChild(createCard(overlay, "overlay"));
  });
}

function renderAccessoryOptions() {
  const group = getAccessoryGroup(state.accessoryType);
  accessoryOptions.innerHTML = "";

  group?.items.forEach((item) => {
    accessoryOptions.appendChild(createAccessoryCard(item));
  });
}

function syncActiveState() {
  document.querySelectorAll('.base-swatch[data-type="base"]').forEach((card) => {
    card.classList.toggle("is-active", card.dataset.id === state.baseId);
  });

  document.querySelectorAll('.option-card[data-type="overlay"]').forEach((card) => {
    card.classList.toggle("is-active", card.dataset.id === state.overlayId);
  });

  document.querySelectorAll("[data-overlay-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.overlayMode === state.overlayMode);
  });

  document.querySelectorAll(".line-color").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lineColor === state.lineColor);
  });

  document.querySelectorAll(".segment-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.type === state.accessoryType);
  });

  document.querySelectorAll(".accessory-color").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.color === state.accessoryColor);
  });

  document.querySelectorAll(".accessory-option").forEach((button) => {
    const selectedInstance = getSelectedAccessoryInstance();
    button.classList.toggle("is-active", button.dataset.id === selectedInstance?.accessoryId);
    const accessory = getAccessoryById(button.dataset.id);
    const image = button.querySelector("img");
    if (accessory && image) {
      image.src = accessory.images[state.accessoryColor];
    }
  });

  document.querySelectorAll(".accessory-layer").forEach((node) => {
    node.classList.toggle("is-selected", node.dataset.instanceId === state.selectedAccessoryInstanceId);
  });
}

function renderAccessories() {
  accessoryCanvas.innerHTML = "";

  state.accessoryInstances.forEach((instance) => {
    const accessory = getAccessoryById(instance.accessoryId);

    if (!accessory?.images?.[instance.color]) {
      return;
    }

    const scale = getAccessoryScale(accessory);
    const node = document.createElement("div");
    node.className = "accessory-layer visible";
    node.dataset.instanceId = instance.instanceId;
    node.style.width = `${scale.width}%`;
    node.style.height = `${scale.height}%`;

    node.innerHTML = `<img src="${accessory.images[instance.color]}" alt="${accessory.name} 配件">`;
    node.addEventListener("pointerdown", (event) => {
      dragState.active = true;
      dragState.instanceId = instance.instanceId;
      state.selectedAccessoryInstanceId = instance.instanceId;
      state.accessoryColor = instance.color;
      node.setPointerCapture(event.pointerId);
      node.classList.add("is-dragging");
      setAccessoryPositionFromPointer(event, instance);
      syncActiveState();
    });

    accessoryCanvas.appendChild(node);
    updateAccessoryNodePosition(instance);
  });
}

function renderAccessorySummary() {
  const selectedInstance = getSelectedAccessoryInstance();
  const selectedAccessory = getAccessoryById(selectedInstance?.accessoryId);
  const selectedColor = getAccessoryColorById(selectedInstance?.color);

  if (!state.accessoryInstances.length) {
    accessoryLabel.textContent = "無配件";
    return;
  }

  if (selectedAccessory) {
    accessoryLabel.textContent = `${state.accessoryInstances.length} 件 / ${selectedAccessory.name} / ${selectedColor?.name ?? ""} / ${selectedInstance.rotation}°`;
    return;
  }

  accessoryLabel.textContent = `${state.accessoryInstances.length} 件配件`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function downloadCanvas(canvas, type) {
  const link = document.createElement("a");
  link.download = `door-design-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL(type, 0.92);
  link.click();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const characters = [...text];
  let line = "";
  let currentY = y;

  characters.forEach((character) => {
    const testLine = line + character;

    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = character;
      currentY += lineHeight;
      return;
    }

    line = testLine;
  });

  if (line) {
    context.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

async function exportDesign(type) {
  const base = getBaseById(state.baseId) ?? catalog.bases[0];
  const overlay = state.overlayMode === "line"
    ? getLineOverlayById(state.overlayId)
    : getOverlayById(state.overlayId) ?? catalog.overlays[0];
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const doorWidth = 703;
  const doorHeight = 2000;
  const padding = 90;
  const summaryHeight = Math.max(430, 260 + state.accessoryInstances.length * 70);

  canvas.width = doorWidth + padding * 2;
  canvas.height = doorHeight + padding * 2 + summaryHeight;

  context.fillStyle = "#fffaf4";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const baseImageForExport = await loadImage(base.image);
  context.drawImage(baseImageForExport, padding, padding, doorWidth, doorHeight);

  const overlayImage = state.overlayMode === "line" ? overlay?.images?.[state.lineColor] : overlay?.image;

  if (overlayImage) {
    const overlayImageForExport = await loadImage(overlayImage);
    context.drawImage(overlayImageForExport, padding, padding, doorWidth, doorHeight);
  }

  for (const instance of state.accessoryInstances) {
    const accessory = getAccessoryById(instance.accessoryId);

    if (!accessory?.images?.[instance.color]) {
      continue;
    }

    const image = await loadImage(accessory.images[instance.color]);
    const width = accessory.size ? accessory.size.width : doorWidth * 0.55;
    const height = accessory.size ? accessory.size.height : doorHeight * 0.28;
    const x = padding + (instance.x / 100) * doorWidth;
    const y = padding + (instance.y / 100) * doorHeight;

    context.save();
    context.translate(x, y);
    context.rotate((instance.rotation * Math.PI) / 180);
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  }

  const summaryY = padding + doorHeight + 70;
  context.fillStyle = "#2f2419";
  context.font = "700 34px Microsoft JhengHei, sans-serif";
  context.fillText("彩燿門 × UV局部彩繪點綴模擬", padding, summaryY);

  context.font = "24px Microsoft JhengHei, sans-serif";
  const lines = [
    `門板底色：${base.name}`,
    `局部點綴：${overlay.name}${state.overlayMode === "line" ? ` / ${getLineColorById(state.lineColor)?.name ?? ""}` : ""}`,
    `配件數量：${state.accessoryInstances.length} 件`
  ];

  let nextY = summaryY + 52;
  lines.forEach((line) => {
    context.fillText(line, padding, nextY);
    nextY += 38;
  });

  if (state.accessoryInstances.length) {
    context.font = "22px Microsoft JhengHei, sans-serif";
    state.accessoryInstances.forEach((instance, index) => {
      const accessory = getAccessoryById(instance.accessoryId);
      const group = getAccessoryGroupByItemId(instance.accessoryId);
      const color = getAccessoryColorById(instance.color);
      const detail = `${index + 1}. ${group?.label ?? "配件"} / ${accessory?.name ?? ""} / ${color?.name ?? ""} / 位置 ${instance.x.toFixed(1)}%, ${instance.y.toFixed(1)}% / 旋轉 ${instance.rotation}°`;
      nextY = wrapText(context, detail, padding, nextY, doorWidth, 30);
    });
  }

  downloadCanvas(canvas, type);
}

function render() {
  const base = getBaseById(state.baseId) ?? catalog.bases[0];
  const overlay = state.overlayMode === "line"
    ? getLineOverlayById(state.overlayId) ?? catalog.lineOverlays[0]
    : getOverlayById(state.overlayId) ?? catalog.overlays[0];

  baseImage.src = base.image;
  baseImage.alt = `${base.name} 門板底圖`;

  const selectedOverlayImage = state.overlayMode === "line" ? overlay?.images?.[state.lineColor] : overlay?.image;

  if (selectedOverlayImage) {
    overlayImage.src = selectedOverlayImage;
    overlayImage.alt = `${overlay.name} 局部點綴`;
    overlayImage.classList.toggle("line-overlay", state.overlayMode === "line");
    overlayImage.classList.add("visible");
    emptyOverlayBadge.hidden = true;
  } else {
    overlayImage.removeAttribute("src");
    overlayImage.classList.remove("line-overlay");
    overlayImage.classList.remove("visible");
    emptyOverlayBadge.hidden = false;
  }

  renderAccessories();

  selectionTitle.textContent = `${base.name} x ${overlay.name}`;
  baseLabel.textContent = base.name;
  overlayLabel.textContent = state.overlayMode === "line"
    ? `${overlay.name} / ${getLineColorById(state.lineColor)?.name ?? ""}`
    : overlay.name;
  renderAccessorySummary();

  syncActiveState();
}

resetButton.addEventListener("click", () => {
  state.overlayId = "none";
  state.overlayMode = "pattern";
  renderOverlayOptions();
  render();
});

overlayModeOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-overlay-mode]");

  if (!button) {
    return;
  }

  state.overlayMode = button.dataset.overlayMode;
  state.overlayId = state.overlayMode === "line" ? catalog.lineOverlays[0]?.id ?? "" : "none";
  renderOverlayOptions();
  render();
});

clearAccessoryButton.addEventListener("click", () => {
  if (state.selectedAccessoryInstanceId) {
    state.accessoryInstances = state.accessoryInstances.filter(
      (instance) => instance.instanceId !== state.selectedAccessoryInstanceId
    );
    state.selectedAccessoryInstanceId = state.accessoryInstances.at(-1)?.instanceId ?? "";
  } else {
    state.accessoryInstances = [];
  }

  render();
});

clearAllAccessoriesButton.addEventListener("click", () => {
  state.accessoryInstances = [];
  state.selectedAccessoryInstanceId = "";
  render();
});

exportPngButton.addEventListener("click", async () => {
  try {
    await exportDesign("image/png");
  } catch (error) {
    alert("存檔失敗，請確認圖片檔案仍在原本資料夾。");
  }
});

positionControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-move]");

  if (!button) {
    return;
  }

  moveAccessory(button.dataset.move);
});

accessoryCanvas.addEventListener("pointermove", (event) => {
  if (!dragState.active) {
    return;
  }

  const instance = state.accessoryInstances.find((item) => item.instanceId === dragState.instanceId);

  if (instance) {
    setAccessoryPositionFromPointer(event, instance);
  }
});

accessoryCanvas.addEventListener("pointerup", (event) => {
  const node = accessoryCanvas.querySelector(`[data-instance-id="${dragState.instanceId}"]`);

  dragState.active = false;
  dragState.instanceId = "";
  node?.releasePointerCapture(event.pointerId);
  node?.classList.remove("is-dragging");
  renderAccessorySummary();
});

accessoryCanvas.addEventListener("pointercancel", () => {
  const node = accessoryCanvas.querySelector(`[data-instance-id="${dragState.instanceId}"]`);

  dragState.active = false;
  dragState.instanceId = "";
  node?.classList.remove("is-dragging");
});

renderOptions();
render();

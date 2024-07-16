const DOMstrings = {
    stepsBtnClass: 'multisteps-form__progress-btn',
    stepsBtns: document.querySelectorAll(`.multisteps-form__progress-btn`),
    stepsBar: document.querySelector('.multisteps-form__progress'),
    stepsForm: document.querySelector('.multisteps-form__form'),
    stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
    stepFormPanelClass: 'multisteps-form__panel',
    stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
    stepPrevBtnClass: 'js-btn-prev',
    stepNextBtnClass: 'js-btn-next' };
   
   
  const removeClasses = (elemSet, className) => {
   
    elemSet.forEach(elem => {
   
      elem.classList.remove(className);
   
    });
   
  };
   
  const findParent = (elem, parentClass) => {
   
    let currentNode = elem;
   
    while (!currentNode.classList.contains(parentClass)) {
      currentNode = currentNode.parentNode;
    }
   
    return currentNode;
   
  };
   
  const getActiveStep = elem => {
    return Array.from(DOMstrings.stepsBtns).indexOf(elem);
  };
   
  const setActiveStep = activeStepNum => {
   
    removeClasses(DOMstrings.stepsBtns, 'js-active');
   
    DOMstrings.stepsBtns.forEach((elem, index) => {
   
      if (index <= activeStepNum) {
        elem.classList.add('js-active');
      }
   
    });
  };
   
  const getActivePanel = () => {
   
    let activePanel;
   
    DOMstrings.stepFormPanels.forEach(elem => {
   
      if (elem.classList.contains('js-active')) {
   
        activePanel = elem;
   
      }
   
    });
   
    return activePanel;
   
  };
   
  const setActivePanel = activePanelNum => {
   
    removeClasses(DOMstrings.stepFormPanels, 'js-active');
   
    DOMstrings.stepFormPanels.forEach((elem, index) => {
      if (index === activePanelNum) {
   
        elem.classList.add('js-active');
   
        setFormHeight(elem);
   
      }
    });
   
  };
   
  const formHeight = activePanel => {
   
    const activePanelHeight = activePanel.offsetHeight;
   
    DOMstrings.stepsForm.style.height = `${activePanelHeight}px`;
   
  };
   
  const setFormHeight = () => {
    const activePanel = getActivePanel();
   
    formHeight(activePanel);
  };
   
  DOMstrings.stepsBar.addEventListener('click', e => {
   
    const eventTarget = e.target;
   
    if (!eventTarget.classList.contains(`${DOMstrings.stepsBtnClass}`)) {
      return;
    }
   
    const activeStep = getActiveStep(eventTarget);
   
    setActiveStep(activeStep);
   
    setActivePanel(activeStep);
  });
   
  DOMstrings.stepsForm.addEventListener('click', e => {
   
    const eventTarget = e.target;
   
    if (!(eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`) || eventTarget.classList.contains(`${DOMstrings.stepNextBtnClass}`)))
    {
      return;
    }
   
    const activePanel = findParent(eventTarget, `${DOMstrings.stepFormPanelClass}`);
   
    let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);
   
    if (eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`)) {
      activePanelNum--;
   
    } else {
   
      activePanelNum++;
   
    }
   
    setActiveStep(activePanelNum);
    setActivePanel(activePanelNum);
   
  });
   
  window.addEventListener('load', setFormHeight, false);
   
  window.addEventListener('resize', setFormHeight, false);
   
   
  const setAnimationType = newType => {
    DOMstrings.stepFormPanels.forEach(elem => {
      elem.dataset.animation = newType;
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.multisteps-form__panel');
    const progressBtns = document.querySelectorAll('.multisteps-form__progress-btn');
    const nextBtns = document.querySelectorAll('.js-btn-next');
    const prevBtns = document.querySelectorAll('.js-btn-prev');
    const submitBtn = document.getElementById('submit-btn');
    let currentStep = 0;
  
    function updateSteps() {
      steps.forEach((step, index) => {
        step.classList.toggle('js-active', index === currentStep);
        progressBtns[index].classList.toggle('js-active', index <= currentStep);
      });
    }
  
    function getAllFormData() {
      const formData = {};
      const formElements = document.querySelectorAll('.multisteps-form__form input, .multisteps-form__form textarea');
      formElements.forEach(element => {
        if (element.type === 'radio' || element.type === 'checkbox') {
          if (element.checked) {
            formData[element.name] = element.value;
          }
        } else {
          formData[element.name] = element.value;
        }
      });
      return formData;
    }
  
    function downloadFile(content, filename) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep++;
        updateSteps();
      });
    });
  
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep--;
        updateSteps();
      });
    });
  
    submitBtn.addEventListener('click', () => {
      const formData = getAllFormData();
      const formDataText = JSON.stringify(formData, null, 2);
      downloadFile(formDataText, 'form_data.txt');
      window.location.assign("recipes.html");
    });
  
    updateSteps();
  });
  
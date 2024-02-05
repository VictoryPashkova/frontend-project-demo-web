import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';

const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  company: yup.string().trim(),
  website: yup.string().url('Enter a valid URL'),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const app = (state) => {
  const salesButtons = document.querySelectorAll('.contact__sales-btn');
  const hamburgerButton = document.querySelector('.header__main-container__hamburger__open-button');
  const formModal = document.querySelector('.modal__form__contact');
  const inputs = document.querySelectorAll('.modal__form__contact__input');
  const modalContainer = document.querySelector('.modal');
  const modal = document.querySelector('.modal__form');
  const headerMainContainer = document.querySelector('.header__main-container');
  const headerMenu = document.querySelector('.header__main-container__header-menu');
  const mainContent = document.querySelector('main');
  const footer = document.querySelector('footer');
  const hamburgerButtonItems = document.querySelectorAll('.header__main-container__hamburger__button__item');
  const hamburgerButtonItemsClose = document.querySelector('.header__main-container__hamburger__close-button');
  const hamburgerButtonClose = document.querySelector('.header__main-container__hamburger__close-button');
  const genFeedBack = document.querySelector('.modal__form__contact__general-feedback');
  const submitBtn = document.querySelector('.sales-btn--submit');
  const modalFormContainer = document.querySelector('.modal__form');
  const modalSuccessContainer = document.querySelector('.modal__success');
  const imgLoading = document.querySelector('.btn-state');
  const btnText = document.querySelector('.text-submit');
  const successBtn = document.querySelector('.modal__success-btn');

  const data = ['name', 'email', 'phone', 'company', 'website'];

  const cleanAllFeedBacks = () => {
    const allInvalidInputs = document.querySelectorAll('.input--invalid');
    const allFeedBacks = document.querySelectorAll('.feedback--active');
    allInvalidInputs.forEach((input) => input.classList.remove('input--invalid'));
    allFeedBacks.forEach((item) => {
      item.classList.remove('feedback--active');
      item.classList.add('invalid-feedback--disabled');
    });
  };

  const renderError = (value) => {
    cleanAllFeedBacks();
    value.forEach((item) => {
      if (state.uiState.isTouched[item] === true) {
        const invalidInput = document.getElementById(item);
        const feedback = document.querySelector(`p.${item}`);
        invalidInput.classList.add('input--invalid');
        feedback.classList.add('feedback--active');
        feedback.classList.remove('invalid-feedback--disabled');
        genFeedBack.classList.add('feedback--active');
        genFeedBack.classList.remove('invalid-feedback--disabled');
      }
    });
  };

  const renderIsValid = () => {
    submitBtn.classList.remove('sales-btn--disabled');
    genFeedBack.classList.remove('feedback--active');
    genFeedBack.classList.add('invalid-feedback--disabled');
  };

  const renderNotValid = () => {
    submitBtn.classList.add('sales-btn--disabled');
    genFeedBack.classList.add('feedback--active');
    genFeedBack.classList.remove('invalid-feedback--disabled');
  };

  const renderModal = () => {
    modalContainer.classList.remove('modal--disabled');
    modalFormContainer.classList.remove('modal--disabled');
  };

  const renderSubmitedForm = () => {
    modalFormContainer.classList.add('modal--disabled');
    modalSuccessContainer.classList.remove('modal--disabled');
    imgLoading.classList.remove('img--loading');
    imgLoading.classList.add('img--disabled');
    btnText.classList.remove('text--disabled');
    submitBtn.classList.remove('sales-btn--loading');
  };

  const renderInitial = () => {
    modalFormContainer.classList.add('modal--disabled');
    modalContainer.classList.add('modal--disabled');
    modalSuccessContainer.classList.add('modal--disabled');
  };

  const renderLoading = () => {
    btnText.classList.add('text--disabled');
    imgLoading.classList.add('img--loading');
    imgLoading.classList.remove('img--disabled');
    submitBtn.classList.add('sales-btn--loading');
  };

  const renderHamMenu = () => {
    headerMenu.classList.remove('menu--disabled');
    mainContent.classList.add('menu--disabled');
    footer.classList.add('menu--disabled');
    hamburgerButtonItems.forEach((item) => {
      item.classList.add('menu--disabled');
    });
    hamburgerButtonItemsClose.classList.remove('menu--disabled');
  };

  const renderCloseHamMenu = () => {
    headerMenu.classList.add('menu--disabled');
    mainContent.classList.remove('menu--disabled');
    footer.classList.remove('menu--disabled');
    hamburgerButtonItems.forEach((item) => {
      item.classList.remove('menu--disabled');
    });
    hamburgerButtonItemsClose.classList.add('menu--disabled');
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'error':
        renderError(value);
        break;
      case 'isValid':
        if (value === true) {
          renderIsValid();
        } else {
          renderNotValid();
        }
        break;
      case 'processState':
        if (value === 'filling') {
          renderModal();
        } else if (value === 'submited') {
          renderSubmitedForm();
        } else if (value === 'initial') {
          renderInitial();
        } else if (value === 'loading') {
          renderLoading();
        }
        break;
      case 'menu':
        if (value === 'active') {
          renderHamMenu();
        } else if (value === 'disabled') {
          renderCloseHamMenu();
        }
        break;
    }
  });

  const validateInput = (e) => {
    const el = e.target.name;
    const { value } = e.target;
    watchedState.data[el] = value;
    watchedState.uiState.isTouched[el] = true;
    watchedState.error = [];
    const getErrors = validate(watchedState.data);
    const errors = Object.keys(getErrors);
    if (!_.isEmpty(errors)) {
      watchedState.error = errors;
    }
    watchedState.isValid = _.isEmpty(errors);
  };

  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      validateInput(e);
    });
    input.addEventListener('click', (e) => {
      validateInput(e);
    });
  });

  formModal.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.processState = 'sending';
    const formData = new FormData(e.target);
    const dataForSending = [];
    data.forEach((el) => {
      const elData = formData.get(el);
      dataForSending.push(elData);
    });
    watchedState.processState = 'loading';
    try {
      // Simulating data sending
      await new Promise((resolve) => setTimeout(resolve, 5000));
      watchedState.processState = 'submited';
      formModal.reset();
    } catch (error) {
      watchedState.processState = 'failed';
      console.error(error);
    }
  });

  salesButtons.forEach((button) => {
    button.addEventListener('click', () => {
      watchedState.processState = 'filling';
      document.addEventListener('click', (e) => {
        const isBtn = e.target.classList.contains('contact__sales-btn');
        const isBtnText = e.target.classList.contains('sales-btn__text');
        if (!modal.contains(e.target) && !isBtn && !isBtnText) {
          console.log(33);
          watchedState.processState = 'initial';
          formModal.reset();
          cleanAllFeedBacks();
        }
      });
    });
  });

  successBtn.addEventListener('click', () => {
    watchedState.processState = 'initial';
  });

  hamburgerButton.addEventListener('click', () => {
    watchedState.menu = 'active';
  });

  hamburgerButtonClose.addEventListener('click', () => {
    watchedState.menu = 'disabled';
  });

  window.addEventListener('scroll', () => {
    const scrollHeightThreshold = 75;
    const currentScrollHeight = window.scrollY;
    if ((currentScrollHeight > scrollHeightThreshold) && state.processState !== 'filling') {
      headerMainContainer.classList.add('position--fixed');
    } else {
      headerMainContainer.classList.remove('position--fixed');
    }
  });
};

const runApp = () => {
  const formState = {
    processState: 'initial',
    data: {
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
    },
    isValid: '',
    error: [],
    uiState: {
      isTouched: {
        name: false,
        email: false,
        phone: false,
        company: false,
        website: false,
      },
    },
    menu: 'disabled',
  };

  app(formState);
};

export default runApp;

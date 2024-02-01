import * as yup from 'yup';
import onChange from 'on-change';
import _, { before } from 'lodash';
// import axios from 'axios';

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

    const salesButtons = document.querySelectorAll('.sales-btn');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const formModal = document.querySelector('.form-modal');
    const inputs = document.querySelectorAll('.form-control');
    const successBtn = document.querySelector('.success-btn');
    const modalContainer = document.querySelector('.modal-container');
    const modal = document.querySelector('.modal-form-container')
    const headerMainContainer = document.querySelector('.header-main-container');
    const headerMenu = document.querySelector('.header-menu-container');
    const mainContent = document.querySelector('.main-content');
    const footer = document.querySelector('.footer');
    const hamburgerButtonItems = document.querySelectorAll('.header-hamburger-item');
    const hamburgerButtonItemsClose = document.querySelector('.header-hamburger-item-close');
    const hamburgerButtonClose = document.querySelector('.hamburger-cls-btn');

    const data = ['name', 'email', 'phone', 'company', 'website'];

    const cleanAllFeedBacks = () => {
      const allInvalidInpurs = document.querySelectorAll('.is-invalid-input');
      allInvalidInpurs.forEach((input) => input.classList.remove('is-invalid-input'))

      const allFeedBacks = document.querySelectorAll('.active-feedback');
      allFeedBacks.forEach((item) => {
        item.classList.remove('active-feedback');
        item.classList.add('notActive');
      })
    }

    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'error':
          cleanAllFeedBacks();
          value.forEach((item) => {
            if (state.uiState.isTouched[item] === true) {
              console.log(true)
              const invalidInput = document.getElementById(item);
              const feedback = document.querySelector(`p.${item}`);
              invalidInput.classList.add('is-invalid-input');
              feedback.classList.add('active-feedback');
              feedback.classList.remove('notActive');
            }
          })
        break;
        case 'isValid':
            if (value === true) {
                const submitBtn = document.querySelector('.submit');
                submitBtn.classList.remove('disabled');
                const genFeedBack = document.querySelector('.general-feedback');
                genFeedBack.classList.remove('active-feedback');
                genFeedBack.classList.add('notActive');
            } else {
                const submitBtn = document.querySelector('.submit');
                submitBtn.classList.add('disabled');
                const genFeedBack = document.querySelector('.general-feedback');
                genFeedBack.classList.add('active-feedback');
                genFeedBack.classList.remove('notActive');
            }
        break;
        case 'processState':
            if (value === 'filling') {
                const modalContainer = document.querySelector('.modal-container');
                const modalFormContainer = document.querySelector('.modal-form-container');
                modalContainer.classList.remove('disabled-modal');
                modalFormContainer.classList.remove('disabled-modal');
            } else if (value === 'submited') {
                const modalFormContainer = document.querySelector('.modal-form-container');
                modalFormContainer.classList.add('disabled-modal');
                const modalSuccessContainer = document.querySelector('.modal-success-container');
                modalSuccessContainer.classList.remove('disabled-modal');
            } else if (value === 'initial') {
                const modalContainer = document.querySelector('.modal-container');
                const modalSuccessContainer = document.querySelector('.modal-success-container');
                const modalFormContainer = document.querySelector('.modal-form-container');
                modalFormContainer.classList.add('disabled-modal');
                modalContainer.classList.add('disabled-modal');
                modalSuccessContainer.classList.add('disabled-modal');
            } else if (value === 'loading') {
                const btnText = document.querySelector('.submit-text');
                btnText.classList.add('disabled-img');
                const img = document.querySelector('.btn-state');
                img.classList.add('loading');
                img.classList.remove('disabled-img');
            }
        break;
        case 'menu':
          if (value === 'active') {
            headerMenu.classList.remove('disabled-menu');
            mainContent.classList.add('disabled-menu');
            footer.classList.add('disabled-menu');
            hamburgerButtonItems.forEach((item) => {
              item.classList.add('disabled-menu');
            })
            
              hamburgerButtonItemsClose.classList.remove('disabled-menu');
          } else if (value === 'disabled') {
            headerMenu.classList.add('disabled-menu');
            mainContent.classList.remove('disabled-menu');
            footer.classList.remove('disabled-menu');
            hamburgerButtonItems.forEach((item) => {
              item.classList.remove('disabled-menu');
            })
              hamburgerButtonItemsClose.classList.add('disabled-menu');
          }
      }
    });

    inputs.forEach((input) => {
        input.addEventListener('input', (e) => {
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
        })
    })

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
        formModal.reset();
     try {
     // Имитируем отправку данных
     await new Promise((resolve) => setTimeout(resolve, 5000));
     watchedState.processState = 'submited';
     } catch (error) {
       watchedState.processState = 'failed';
       console.error(error);
     }
        //в реальности было бы что-то такое
        // try {
        //   const response = await axios.post(routes.usersPath(), dataForSending);
        //   if (response.status === 200) {
        //     watchedState.processState = 'submited';
        //   } else {
        //     watchedState.processState = 'failed';
        //   }
        // } catch (error) {
        //   watchedState.processState = 'failed';
        //   throw error;
        // }
      });

      salesButtons.forEach((button) => {
        button.addEventListener('click', () => {
           watchedState.processState = 'filling';
           document.addEventListener('click', (e) => {
            const isBtn = e.target.classList.contains('sales-btn');
            const isBtnText = e.target.classList.contains('btm-text-sales');
            console.log(!modalContainer.contains(e.target))
            if (!modal.contains(e.target) && !isBtn && !isBtnText) {
                watchedState.processState = 'initial';
                formModal.reset();
                cleanAllFeedBacks();
            }
          });
        })
      })

      successBtn.addEventListener('click', () => {
        watchedState.processState = 'initial';
      })

      hamburgerButton.addEventListener('click', () => {
         watchedState.menu = 'active';
      })

      hamburgerButtonClose.addEventListener('click', () => {
        console.log(1)
        watchedState.menu = 'disabled';
      })

      window.addEventListener('scroll', () => {
        const scrollHeightThreshold = 75;
        const currentScrollHeight = window.scrollY;
        if ((currentScrollHeight > scrollHeightThreshold) && state.processState !== 'filling') {
          headerMainContainer.classList.add('fixed');
        } else {
          headerMainContainer.classList.remove('fixed');
        }
      });

}

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
      }
    },
    menu: 'disabled',
  }
  app(formState);
};

export default runApp;

// TODO - Add <Head> section

import { useState } from 'react';
import Dots from '../../components/layout/main-content/contact-page/Dots';
import LoadingSpinner from '../../components/ui/svg/LoadingSpinner';

const inputClasses =
  'py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md';
const labelClasses = 'block text-sm font-medium text-gray-700';

const successMessage = 'Email sent successfully!';

const Contact = () => {
  const [enteredFirstName, setEnteredFirstName] = useState('');
  const [enteredLastName, setEnteredLastName] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredMessage, setEnteredMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const formIsValid = () =>
    enteredFirstName.trim().length > 0 &&
    enteredEmail.trim().length > 0 &&
    enteredMessage.trim().length > 0;

  const resetForm = () => {
    setEnteredFirstName('');
    setEnteredLastName('');
    setEnteredEmail('');
    setEnteredMessage('');
  };

  const disableButton = () => !formIsValid() || isSubmitting;

  const handleFormFieldChange = (updateFunction, newValue) => {
    updateFunction(newValue);
    setSendStatus('');
  };

  const formSubmitHandler = async event => {
    event.preventDefault();
    setIsSubmitting(true);
    setSendStatus('');

    if (!formIsValid()) return;

    try {
      const response = await fetch('/api/sendgrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enteredFirstName: enteredFirstName.trim(),
          enteredLastName: enteredLastName.trim(),
          enteredEmail: enteredEmail.trim(),
          enteredMessage: enteredMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSendStatus(successMessage);
        setIsSubmitting(false);
        resetForm();
      } else {
        throw new Error(data.error_message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSendStatus(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24'>
      <div className='relative max-w-xl mx-auto'>
        <Dots positionClasses='left-full' translateClass='translate-x-1/2' />
        <Dots positionClasses='right-full bottom-0' translateClass='-translate-x-1/2' />
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            Get in touch
          </h2>
          <p className='mt-4 text-lg leading-6 text-gray-500'>
            Interested in working together, any comments or questions, or just want to say hi, send
            me an email below.
          </p>
        </div>
        <div className='mt-12'>
          <form
            onSubmit={formSubmitHandler}
            className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8'
          >
            <div>
              <label htmlFor='first-name' className={labelClasses}>
                First name*
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  className={inputClasses}
                  value={enteredFirstName}
                  onChange={event => handleFormFieldChange(setEnteredFirstName, event.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor='last-name' className={labelClasses}>
                Last name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  className={inputClasses}
                  value={enteredLastName}
                  onChange={event => handleFormFieldChange(setEnteredLastName, event.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='email' className={labelClasses}>
                Email*
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className={inputClasses}
                  value={enteredEmail}
                  onChange={event => handleFormFieldChange(setEnteredEmail, event.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='message' className={labelClasses}>
                Message*
              </label>
              <div className='mt-1'>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className={`${inputClasses} border`}
                  value={enteredMessage}
                  onChange={event => handleFormFieldChange(setEnteredMessage, event.target.value)}
                />
              </div>
            </div>
            {sendStatus && (
              <div
                className={
                  sendStatus === successMessage ? 'text-green-400' : 'text-rose-500 font-bold'
                }
              >
                {sendStatus}
              </div>
            )}
            <div className='sm:col-span-2'>
              <button
                disabled={disableButton()}
                type='submit'
                className='w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {isSubmitting ? <LoadingSpinner /> : 'Send email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * A component that renders translated text with support for interpolation and components
 * @param {string} path - The translation key path (e.g., 'common.buttons.submit')
 * @param {object} values - Values for interpolation
 * @param {object} components - React components to be interpolated into the translation
 * @param {string} [defaultText] - Fallback text if translation is missing
 * @param {string} [className] - Additional CSS class names
 * @param {object} [style] - Inline styles
 * @param {string} [tag] - HTML tag to render (default: 'span')
 */
const TranslatedText = ({
  path,
  values = {},
  components = {},
  defaultText = '',
  className = '',
  style = {},
  tag: Tag = 'span',
  ...props
}) => {
  const { t } = useTranslation();
  
  try {
    // If components are provided, we need to use the Trans component
    if (Object.keys(components).length > 0) {
      const { Trans } = require('react-i18next');
      return (
        <Trans
          i18nKey={path}
          defaults={defaultText}
          values={values}
          components={components}
          {...props}
        >
          <Tag className={className} style={style} />
        </Trans>
      );
    }
    
    // Simple translation without components
    const translatedText = t(path, { ...values, defaultValue: defaultText });
    
    return (
      <Tag className={className} style={style} {...props}>
        {translatedText}
      </Tag>
    );
  } catch (error) {
    console.error(`Translation error for key: ${path}`, error);
    return <Tag className={className} style={style} {...props}>{defaultText || path}</Tag>;
  }
};

TranslatedText.propTypes = {
  path: PropTypes.string.isRequired,
  values: PropTypes.object,
  components: PropTypes.object,
  defaultText: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  tag: PropTypes.string
};

export default TranslatedText;

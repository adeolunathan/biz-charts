// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/index.js
import Fields from './Fields';
import General from './General';
import Format from './Format';

/**
 * CustomizationPanel is a collection of sub-panels
 * for different aspects of chart customization.
 *
 * This modular approach allows us to:
 * 1. Split large components into smaller, manageable pieces
 * 2. Only load the panels that are actually needed
 * 3. Keep related code together
 */
const CustomizationPanel = {
  Fields,
  General,
  Format
};

export default CustomizationPanel;
var domify = require('domify');
var extend = require('amp-extend');
var uniqId = require('amp-unique-id');
var RadioView = require('radio-input');
var isIE = !!~navigator.userAgent.indexOf('MSIE') || !!~navigator.appVersion.indexOf('Trident/');


var radioTemplate = [
  '<li>',
    '<input type="radio">',
    '<label data-hook="label">',
      '<img>',
    '</label>',
  '</li>'
].join('');

function ImageRadioView(opts) {
  RadioView.apply(this, arguments);
}

extend(ImageRadioView.prototype, RadioView.prototype, {
  createOption: function (value, text, name, id) {
    var node = domify(radioTemplate),
      input = node.querySelector('input'),
      label = node.querySelector('[data-hook=label]'),
      img = label.querySelector('img'),
      group = this;

    id = id || uniqId(name + '_' + value);

    if (label) {
      label.setAttribute('for', id);
    }
    if (img) {
      img.src = text;
      img.alt = value; // TODO: havent figured out a great solution for this yet
    }

    input.id = id;
    input.name = name;
    input.value = value;

    input.addEventListener('click', function (e) {
      if (this.value === group.value && !group.isChanging) {
        group.setValue(null);
      }
    });

    if (isIE) {
      img.addEventListener('click', function () {
        if (input.value === group.value && !group.isChanging) {
          group.setValue(null);
        } else {
          group.setValue(input.value);
        }
      });
    }

    return node;
  },

  onChange: function () {
    this.isChanging = true;

    RadioView.prototype.onChange.apply(this, arguments);

    setTimeout(function () {
      this.isChanging = false;
    }.bind(this), 0);
  }
});

module.exports = ImageRadioView;

{
    'name': 'Notification Link',
    'version': '17.0.1.0',
    'category': 'Mail',
    'website': 'https://adreaminnovations.odoo.com',
    'author': 'ADream Innovations',
    'summary': 'Adds a button to notifications to redirect to the related record',
    'description': 'This module adds a "View Record" button to Odoo notifications when they are linked to a specific document.',
    'depends': ['mail'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'ad_notification_link/static/src/scss/notification_style.scss',
            'ad_notification_link/static/src/js/notification_handler_patch.js',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
    'images': ['static/description/banner.png'],
}

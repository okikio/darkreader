import {isURLEnabled, isPDF, isURLMatched, isURLInList} from '../src/utils/url';
import {UserSettings} from '../src/definitions';

test('URL is enabled', () => {

    // Not invert listed
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.*'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.*/mail'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com/maps'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);

    // Invert listed only
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.*/mail'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com/maps'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);

    // Special URLs
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: ['chrome.google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: ['chrome.google.com'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteList: ['microsoftedge.microsoft.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteList: ['microsoftedge.microsoft.com'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf',
        {enableForPDF: true, siteList: ['https://www.google.com/very/good/hidden/folder/pdf#file.pdf'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);

    // Test for PDF enabling
    expect(isPDF(
        'https://www.google.com/file.pdf'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf?id=2'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf/resource'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/resource?file=file.pdf'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf'
    )).toBe(false);

    // IPV6 Testing
    expect(isURLEnabled(
        '[::1]:1337',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8080'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8081'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8081'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[::1]:17',
        {siteList: ['[::1]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8888]',
        {siteList: ['[2001:4860:4860::8888]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteList: ['[2001:4860:4860::8844]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteList: [], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toEqual(false);

    // Test wildcards usage
    expect(isURLMatched('https://www.google.com/', 'google.*')).toBe(true);
    expect(isURLMatched('https://www.googla.com/', 'google.*')).toBe(false);
    expect(isURLMatched('https://mail.google.com/compose', 'mail.google.*')).toBe(true);
    expect(isURLMatched('https://www.google.com/compose', 'mail.google.*')).toBe(false);
    expect(isURLMatched('https://mail.google.com/compose/new', 'mail.google.*/new')).toBe(true);
    expect(isURLMatched('https://mail.google.com/compose/sented', 'mail.google.*/new')).toBe(false);


    // Test Negative patterns
    expect(isURLMatched('https://www.discordapp.com/', '!blog.discordapp.com')).toBe(true);
    expect(isURLMatched('https://blog.discordapp.com/', '!blog.discordapp.com')).toBe(false);
    expect(isURLMatched('https://www.discordapp.com/', '!blog.*.com')).toBe(true);
    expect(isURLMatched('https://blog.example.com/', '!blog.*.com')).toBe(false);


    // Test with list's
    expect(isURLInList('https://www.google.com', ['google.com', 'example.org'])).toBe(true);
    expect(isURLInList('https://www.google.org', ['google.com', 'example.org'])).toBe(false);
    expect(isURLInList('https://mail.google.com/mail/u/0/', ['example.org', 'google.*/mail/*/0'])).toBe(true);
    expect(isURLInList('https://mail.google.com/mail/u/1/', ['example.org', 'google.*/mail/*/0'])).toBe(false);
    expect(isURLInList('https://www.discordapp.com', ['discordapp.com', '!blog.discordapp.com'])).toBe(true);
    expect(isURLInList('https://blog.discordapp.com', ['discordapp.com', '!blog.discordapp.com'])).toBe(false);
    expect(isURLInList('https://support.discordapp.com', ['discordapp.com', '!blog.discordapp.com'])).toBe(true);
    expect(isURLInList('https://support.discordapp.com', ['discordapp.com', '!support.discordapp.com'])).toBe(false);
    expect(isURLInList('https://mail.google.com/compose/', ['google.com', '!mail.google.com', 'mail.google.com/compose'])).toBe(true);
    expect(isURLInList('https://mail.google.com/', ['google.com', '!mail.google.com', 'mail.google.com/compose'])).toBe(false);


    // Temporary Dark Sites list fix
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: ['darkreader.org'], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://google.com/',
        {siteList: [], siteListEnabled: ['darkreader.org'], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
});

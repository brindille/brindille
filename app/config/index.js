module.exports = {
    /*
        Display debug logs
     */
    verbose: true,
    /*
        Where yours assets are.
        Can be your CDN URL or a folder
     */
    assetsRoot: 'assets/',
    /*
        Some constants you want for your entire project
     */
    constants: {
        TRANSITION_NONE: 'no-transition',
        TRANSITION_OUT_AFTER_IN: 'outAndAfterIn',
        TRANSITION_IN_AFTER_OUT: 'inAndAfterOut',
        TRANSITION_IN_OUT_TOGETHER: 'inAndOutTogether',
        TRANSITION_IN_ONLY: 'inOnly',
        TRANSITION_OUT_ONLY: 'outOnly'
    }
};
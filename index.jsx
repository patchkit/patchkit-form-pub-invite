import React from 'react'
import ref from 'ssb-ref'
import MDLSpinner from 'patchkit-mdl-spinner'
import { InviteErrorExplanation, InviteErrorHelp } from './help'
import t from 'patchwork-translations'

export default class PubInvite extends React.Component {
  static propTypes = {
    setIsHighlighted: React.PropTypes.func.isRequired,
    setIsValid: React.PropTypes.func.isRequired,
    code: React.PropTypes.string
  }

  static contextTypes = {
    ssb: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      code: this.props.code,
      info: false,
      error: false,
      isProcessing: false
    }
  }

  onChange(e) {
    this.setState({ code: e.target.value })    
  }

  componentDidMount() {
    this.props.setIsHighlighted(true)
    this.props.setIsValid(true)
  }

  getValues(cb) {
    cb({ code: this.state.code })
  }

  submit(cb) {
    this.getValues(values => {
      let code = values.code || ''
      this.setState({ isProcessing: true, error: false, info: false })

      // surrounded by quotes?
      // (the scuttlebot cli ouputs invite codes with quotes, so this could happen)
      if (code.charAt(0) == '"' && code.charAt(code.length - 1) == '"')
        code = code.slice(1, -1) // strip em

      // validate
      if (!code)
        return this.setState({ isProcessing: false, error: { message: t('invite.CodeNotProvided') } })
      if (!ref.isInvite(code))
        return this.setState({ isProcessing: false, error: { message: t('invite.InvalidCode') } })

      // use the invite
      this.setState({ info: t('invite.Contacting') })
      this.context.ssb.invite.accept(code, err => {
        if (err) {
          console.error(err)
          return this.setState({ isProcessing: false, info: false, error: err })
        }

        // trigger sync with the pub
        this.context.ssb.gossip.connect(code.split('~')[0])
        cb()
      })
    })
  }
  render() {
    const msg = (this.state.error) ?
      <InviteErrorExplanation error={this.state.error} /> :
      (this.state.info || '')
    const helpText = (this.state.error) ? <InviteErrorHelp error={this.state.error} /> : ''

    return <div>
      <h1>{t('invite.JoinPub')}</h1>
      <h3>{t('invite.JoinPubInfo')}</h3>
      <form className="fullwidth" onSubmit={e=>e.preventDefault()}>
        <fieldset>
          <input type="text" value={this.state.code} onChange={this.onChange.bind(this)} placeholder={t('invite.EnterCode')}/>
          <div>{msg}</div>
          <div>{helpText}</div>
        </fieldset>
      </form>
      { this.state.isProcessing ? <MDLSpinner /> : '' }
      <div className="faq text-center">
        { this.props.gotoNextStep ?
          <div><a onClick={this.props.gotoNextStep}>{t('invite.CanSkip')}</a>{t('invite.CanSkip2')}</div>
          : '' }
        <div className="faq-entry">
          <div>{t('invite.q.WhatIs')}</div>
          <div>{t('invite.a.WhatIs')}</div>
        </div>
        <div className="faq-entry">
          <div>{t('invite.q.WhereCan')}</div>
          <div>{t('invite.a.WhereCan')}</div>
        </div>
        <div className="faq-entry">
          <div>{t('invite.q.CanCreate')}</div>
          <div>{t('invite.a.CanCreate1')}<a href="http://ssbc.github.io/docs/scuttlebot/howto-setup-a-pub.html" target="_blank">{t('invite.a.CanCreate2')}</a>{t('invite.a.CanCreate3')}</div>
        </div>
      </div>
    </div>
  }
}
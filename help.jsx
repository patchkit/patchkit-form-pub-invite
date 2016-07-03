import React from 'react'
import t from 'patchwork-translations'

export class InviteErrorExplanation extends React.Component {
  render() {
    if (!this.props.error)
      return <span/>
    console.log(this.props.error)
    const msg = this.props.error.message.toLowerCase()

    if (~msg.indexOf('invite code not provided'))
      return <div className="error">{t('invite.error.codeRequired')}</div>

    if (~msg.indexOf('invite not accepted'))
      return <div className="error">{t('invite.error.notAccepted')}</div>

    if (~msg.indexOf('incorrect or expired') || ~msg.indexOf('has expired'))
      return <div className="error">{t('invite.error.expired')}</div>

    if (~msg.indexOf('invalid') || ~msg.indexOf('feed to follow is missing') || ~msg.indexOf('may not be used to follow another key'))
      return <div className="error">{t('invite.error.somethingWrong')}</div>

    if (~msg.indexOf('pub server did not have correct public key'))
      return <div className="error">{t('invite.error.connectionFailure')}</div>

    if (~msg.indexOf('unexpected end of parent stream'))
      return <div className="error">{t('invite.error.failedConnect')}</div>

    if (~msg.indexOf('ENOTFOUND'))
      return <div className="error">{t('invite.error.notFound')}</div>

    if (~msg.indexOf('already following'))
      return <div className="error">{t('invite.error.alreadyFollowed')}</div>

    return <div className="error">{t('invite.error.unexpectedError', {msg})}</div>
  }
}

export class InviteErrorHelp extends React.Component {
  render() {
    if (!this.props.error)
      return <span/>
    const err = this.props.error
    let msg = err.message.toLowerCase()
    let helpText = false

    if (~msg.indexOf('invite not accepted'))
      helpText = t('invite.help.codeRequired')

    if (~msg.indexOf('incorrect or expired') || ~msg.indexOf('has expired'))
      helpText = t('invite.help.notAccepted')

    if (~msg.indexOf('invalid') || ~msg.indexOf('feed to follow is missing') || ~msg.indexOf('may not be used to follow another key'))
      helpText = t('invite.help.somethingWrong')

    if (~msg.indexOf('pub server did not have correct public key'))
      helpText = t('invite.help.connectionFailure')

    if (~msg.indexOf('could not connect to server') || ~msg.indexOf('unexpected end of parent stream'))
      helpText = t('invite.help.failedConnect')

    if (~msg.indexOf('ENOTFOUND'))
      helpText = t('invite.help.notFound')

    if (!helpText)
      return <span/>
    return <div className="help-text">{helpText}</div>
  }
}

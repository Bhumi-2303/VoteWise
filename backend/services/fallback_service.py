"""
Fallback Service for VoteWise AI.
Provides pre-defined civic education responses when Gemini API is unavailable.
"""

FALLBACK_KNOWLEDGE = {
    "English": {
        "vote_where": "You can find your polling place through your local election office or by using our District Lookup tool with your ZIP code.",
        "docs_needed": "Typically, you need a valid photo ID (driver's license, passport) and proof of residence. Requirements vary by state.",
        "ballot_measures": "Ballot measures are proposals for new laws or changes to existing ones that citizens vote on directly.",
        "general_help": "I'm currently in high-reliability mode. I can help with basic voting rules and finding your representatives."
    },
    "Hindi": {
        "vote_where": "आप अपने स्थानीय चुनाव कार्यालय के माध्यम से या अपने पिन कोड के साथ हमारे 'डिस्ट्रिक्ट लुकअप' टूल का उपयोग करके अपना मतदान केंद्र पा सकते हैं।",
        "docs_needed": "आमतौर पर, आपको एक वैध फोटो आईडी और निवास के प्रमाण की आवश्यकता होती है। नियम अलग-अलग राज्यों में अलग-अलग होते हैं।",
        "ballot_measures": "बैलेट उपाय नए कानूनों के प्रस्ताव हैं जिन पर नागरिक सीधे मतदान करते हैं।",
        "general_help": "मैं अभी उच्च-विश्वसनीयता मोड में हूँ। मैं बुनियादी मतदान नियमों में मदद कर सकता हूँ।"
    },
    "Gujarati": {
        "vote_where": "તમે તમારી સ્થાનિક ચૂંટણી કચેરી દ્વારા અથવા તમારા પિન કોડ સાથે અમારા 'ડિસ્ટ્રિક્ટ લુકઅપ' ટૂલનો ઉપયોગ કરીને તમારું મતદાન મથક શોધી શકો છો.",
        "docs_needed": "સામાન્ય રીતે, તમારે માન્ય ફોટો આઈડી અને રહેઠાણના પુરાવાની જરૂર હોય છે. નિયમો દરેક રાજ્યમાં અલગ અલગ હોય છે.",
        "ballot_measures": "બેલેટ માપદંડો એ નવા કાયદાઓ માટેની દરખાસ્તો છે જેના પર નાગરિકો સીધો મત આપે છે.",
        "general_help": "હું હાલમાં ઉચ્ચ-વિશ્વસનીયતા મોડમાં છું. હું મૂળભૂત મતદાન નિયમોમાં મદદ કરી શકું છું."
    }
}

def get_fallback_response(query: str, language: str = "English") -> str:
    """
    Returns a semi-intelligent response based on keyword matching for critical topics.
    """
    lang_data = FALLBACK_KNOWLEDGE.get(language, FALLBACK_KNOWLEDGE["English"])
    
    query_lower = query.lower()
    
    if "where" in query_lower or "place" in query_lower or "कहाँ" in query_lower or "ક્યાં" in query_lower:
        return lang_data["vote_where"]
    if "doc" in query_lower or "id" in query_lower or "दस्तावेज" in query_lower or "દસ્તાવેજ" in query_lower:
        return lang_data["docs_needed"]
    if "ballot" in query_lower or "measure" in query_lower or "मतपत्र" in query_lower or "બેલેટ" in query_lower:
        return lang_data["ballot_measures"]
        
    return lang_data["general_help"]

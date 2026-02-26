//! Helper utilities for formatting and display

use soroban_sdk::{String, Env, Bytes};

/// Formats a group ID for display with a "GROUP-" prefix.
/// 
/// # Arguments
/// * `env` - Soroban environment for string allocation
/// * `group_id` - The numeric group ID to format
/// 
/// # Returns
/// A formatted string in the format "GROUP-{id}"
/// 
/// # Example
/// ```
/// let formatted = format_group_id(&env, 42);
/// // Returns: "GROUP-42"
/// ```
pub fn format_group_id(env: &Env, group_id: u64) -> String {
    // Convert u64 to bytes manually
    let mut num = group_id;
    let mut digits = Bytes::new(env);
    
    if num == 0 {
        digits.push_back(b'0');
    } else {
        // Build digits in reverse, then reverse them
        let mut temp = Bytes::new(env);
        while num > 0 {
            temp.push_back(b'0' + (num % 10) as u8);
            num /= 10;
        }
        // Reverse the digits
        for i in (0..temp.len()).rev() {
            digits.push_back(temp.get(i).unwrap());
        }
    }
    
    // Build the final string: "GROUP-" + digits
    let mut result = Bytes::new(env);
    result.push_back(b'G');
    result.push_back(b'R');
    result.push_back(b'O');
    result.push_back(b'U');
    result.push_back(b'P');
    result.push_back(b'-');
    
    // Append digits
    for i in 0..digits.len() {
        result.push_back(digits.get(i).unwrap());
    }
    
    String::from_bytes(env, &result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_format_group_id_single_digit() {
        let env = Env::default();
        let result = format_group_id(&env, 1);
        assert_eq!(result, String::from_str(&env, "GROUP-1"));
    }

    #[test]
    fn test_format_group_id_multi_digit() {
        let env = Env::default();
        let result = format_group_id(&env, 12345);
        assert_eq!(result, String::from_str(&env, "GROUP-12345"));
    }

    #[test]
    fn test_format_group_id_zero() {
        let env = Env::default();
        let result = format_group_id(&env, 0);
        assert_eq!(result, String::from_str(&env, "GROUP-0"));
    }

    #[test]
    fn test_format_group_id_max_value() {
        let env = Env::default();
        let result = format_group_id(&env, u64::MAX);
        let expected = String::from_str(&env, "GROUP-18446744073709551615");
        assert_eq!(result, expected);
    }
}
